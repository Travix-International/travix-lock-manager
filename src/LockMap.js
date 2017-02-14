'use strict';

const { CODES, MODES } = require('./constants');
const { isFunction, isString, isObject, validate } = require('./helpers');
const Lock = require('./Lock');
const LockList = require('./LockList');

const isArray = Array.isArray;

function normalize(delimiter, key, name = 'key') {
  key = validate(name, 'a string', key, isString);
  const { length } = delimiter;
  if (length) {
    while (key.startsWith(delimiter)) {
      key = key.substring(length);
    }
    while (key.endsWith(delimiter)) {
      key = key.substring(0, key.length - length);
    }
  }
  return key;
}

function *spawn(delimiter, items, mode, owner) {
  const modes = [];
  let total = 0;
  for (const priority of MODES) {
    if (priority & mode) {
      modes.push(priority);
      total |= priority;
    }
  }
  validate('mode', 'known lock modes', total, total === mode);
  mode = modes.shift();
  const locks = items.map(item =>
    isObject(item)
      ? new Lock(
          normalize(delimiter, item.key, 'lock.key'),
          item.mode == null
            ? mode
            : validate('lock.mode', 'known lock mode', item.mode, CODES[item.mode] != null),
          item.owner == null
            ? owner
            : item.owner
        )
      : new Lock(normalize(delimiter, item), mode, owner)
  );
  yield locks;
  while (modes.length) {
    mode = modes.shift();
    for (let i = locks.length; --i >= 0;) {
      locks[i] = new Lock(locks[i].key, mode, owner);
    }
    yield locks;
  }
}

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
    const acquired = [];
    const failed = [];
    const keys = key == null
      ? []
      : isArray(key) ? key : [key];
    if (keys.length) {
      const spawned = spawn(delimiter, keys, mode, owner);
      for (const locks of spawned) {
        acquired.length = 0;
        let success = true;
        for (const lock of locks) {
          const list = this.resolve(lock.key);
          if (!list.acquire(lock, acquired, failed)) {
            success = false;
            break;
          }
        }
        if (success) {
          try {
            await onacquire(acquired);
            for (const lock of acquired) lists.get(lock.key).extend(lock);
            return acquired;
          } catch (error) {
            for (const lock of acquired) lists.get(lock.key).remove(lock);
            throw error;
          }
        }
      }
      throw new AcquireError('Some requested locks cannot be acquired', failed);
    }
    return acquired;
  }

  async release(key, mode, owner) {
    const { config: { delimiter, onrelease }, lists } = this;
    const keys = key == null
      ? Array.from(lists.keys())
      : isArray(key) ? key : [key];
    const released = [];
    if (keys.length) {
      const spawned = spawn(delimiter, keys, mode, owner);
      for (const locks of spawned) {
        for (const lock of locks) {
          this.resolve(lock.key).release(lock, released);
        }
      }
      try {
        if (released.length) await onrelease(released);
        for (const lock of released) lists.get(lock.key).remove(lock);
      } catch (error) {
        for (const lock of released) lists.get(lock.key).extend(lock);
        throw error;
      }
    }
    return released;
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

module.exports = LockMap;
