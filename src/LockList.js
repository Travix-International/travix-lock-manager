'use strict';

const { COMPATIBILITIES, ESCALATIONS } = require('./constants');
const Lock = require('./Lock');

const { defineProperty } = Object;

const pending = new WeakSet;
const timers = new WeakMap;

class LockList {
  constructor(config, key, parent) {
    this.config = config;
    this.key = key;
    this.locks = [];
    this.parent = parent;
  }

  acquire(lock, passed, failed) {
    const { config: { comparer }, locks } = this;
    const { mode, owner } = lock;
    let compatibility = COMPATIBILITIES[mode];
    for (const present of locks) {
      if (present.primary && present.mode === mode && comparer(present.owner, owner)) {
        passed.push(present);
        return true;
      }
      if (!(present.mode & compatibility)) {
        failed.push(lock);
        return false;
      }
    }
    const { parent } = this;
    if (parent && !parent.capture(lock)) {
      failed.push(lock);
      return false;
    }
    pending.add(lock);
    locks.push(lock);
    passed.push(lock);
    return true;
  }

  capture(lock) {
    const { locks } = this;
    const escalation = ESCALATIONS[lock.mode];
    const compatibility = COMPATIBILITIES[escalation];
    for (const present of locks) {
      if (!(present.mode & compatibility)) return false;
    }
    const { key, parent } = this;
    const captured = new Lock(key, escalation, lock.owner, false);
    if (parent && !parent.capture(captured)) return false;
    defineProperty(lock, 'parent', { value: captured });
    locks.push(captured);
    return true;
  }

  extend(lock) {
    pending.delete(lock);
    const { config: { timeout } } = this;
    if (!timeout) return;
    clearTimeout(timers.get(lock));
    timers.set(lock, setTimeout(
      async () => {
        try {
          await this.config.onrelease([lock]);
          this.remove(lock);
        } catch (error) {
          this.extend(lock);
          throw error;
        }
      },
      timeout
    ));
  }

  release(lock, passed) {
    const { config: { comparer }, locks } = this;
    const { mode, owner } = lock;
    for (const present of locks) {
      if (present.primary && present.mode === mode && comparer(present.owner, owner)) {
        if (pending.has(present)) break;
        pending.add(present);
        clearTimeout(timers.get(present));
        passed.push(present);
      }
    }
  }

  remove(lock) {
    const { locks } = this;
    for (let i = locks.length; --i >= 0;) {
      if (lock === locks[i]) {
        pending.delete(lock);
        locks.splice(i, 1);
        break;
      }
    }
    const { parent } = this;
    if (parent) parent.remove(lock.parent);
  }
}

module.exports = LockList;
