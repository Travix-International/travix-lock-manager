/* global Map, Set */

'use strict';

import LockList from './LockList';
import { isArray, isFunction, normalize, spawn, validate } from './utilites';

class LockMap {
  constructor(config) {
    this.config = config;
    this.lists = new Map;
  }

  get keys() {
    const result = [];
    for (const [key, list] of this.lists.entries()) {
      if (list.locks.length) result.push(key);
    }
    return result;
  }

  get locks() {
    const result = [];
    for (const { locks } of this.lists.values()) {
      result.push(...locks);
    }
    return result;
  }

  async acquire(key, mode, owner) {
    const { config: { AcquireError, delimiter, onacquire }, lists } = this;
    const failed = [];
    for (const locks of spawn(delimiter, key, mode, owner)) {
      const passed = [];
      let success = true;
      for (const lock of locks) {
        const list = this.resolve(lock.key);
        if (!list.acquire(lock, passed, failed)) {
          list.remove(lock);
          success = false;
          break;
        }
      }
      if (success) {
        try {
          await onacquire(passed);
          for (const lock of passed) lists.get(lock.key).extend(lock);
          return passed;
        } catch (error) {
          for (const lock of passed) lists.get(lock.key).remove(lock);
          throw error;
        }
      }
    }
    throw new AcquireError('Some requested locks cannot be acquired', failed);
  }

  async release(key, mode, owner) {
    const { config: { delimiter, onrelease }, lists } = this;
    key = key == null
      ? Array.from(lists.keys())
      : key;
    const passed = [];
    for (const locks of spawn(delimiter, key, mode, owner)) {
      for (const lock of locks) {
        this.resolve(lock.key).release(lock, passed);
      }
    }
    try {
      if (passed.length) await onrelease(passed);
      for (const lock of passed) lists.get(lock.key).remove(lock);
      return passed;
    } catch (error) {
      for (const lock of passed) lists.get(lock.key).extend(lock);
      throw error;
    }
  }

  resolve(key) {
    const { lists } = this;
    let list = lists.get(key);
    if (!list) {
      const { config, config: { delimiter } } = this;
      let parent;
      if (key.length && delimiter.length) {
        const i = key.lastIndexOf(delimiter);
        parent = this.resolve(i < 1 ? '' : key.substring(0, i));
      }
      list = new LockList(config, key, parent);
      lists.set(key, list);
    }
    return list;
  }

  select(key, predicate) {
    if (isFunction(key)) {
      predicate = key;
      key = null;
    }
    else if (predicate != null) {
      validate('predicate', 'a function', predicate, isFunction);
    }
    const { config: { delimiter }, lists } = this;
    const keys = [];
    if (key == null) {
      keys.push(...this.lists.keys());
    } else if (isArray(key)) {
      const { length } = key;

      for (let i = -1; ++i < length;) {
        keys.push(normalize(delimiter, key[i], `keys[${i}]`));
      }
    } else {
      keys.push(normalize(delimiter, key));
    }
    const set = new Set;
    for (key of keys) {
      let list = lists.get(key);
      if (!list) continue;

      for (const lock of list.locks) {
        if (!predicate || predicate(lock)) set.add(lock);
      }
    }
    return set;
  }
}

export default LockMap;
