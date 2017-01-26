'use strict';

import { COMPATIBILITIES, ESCALATIONS } from './constants';
import Lock from './Lock';

const captures = new WeakMap;
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
    if (parent && !parent.capture(lock)) return false;
    pending.add(lock);
    locks.push(lock);
    passed.push(lock);
    return true;
  }

  capture(lock) {
    const { key, locks } = this;
    const { mode, owner } = lock;
    const escalation = ESCALATIONS[mode];
    const compatibility = COMPATIBILITIES[escalation];
    for (const present of locks) {
      if (!(present.mode & compatibility)) return false;
    }
    const capture = new Lock(key, escalation, owner, false);
    let { parent } = this;
    if (parent && !parent.capture(capture)) return false;
    captures.set(lock, capture);
    locks.push(capture);
    return true;
  }

  extend(lock) {
    const { config: { onrelease, timeout } } = this;
    pending.delete(lock);
    if (!timeout) return;
    clearTimeout(timers.get(lock));
    timers.set(lock, setTimeout(
      async () => {
        try {
          await onrelease([lock]);
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
    const { locks, parent } = this;
    for (let i = locks.length; --i >= 0;) {
      if (lock === locks[i]) {
        pending.delete(lock);
        locks.splice(i, 1);
        break;
      }
    }
    if (parent) parent.remove(captures.get(lock));
  }
}

export default LockList;
