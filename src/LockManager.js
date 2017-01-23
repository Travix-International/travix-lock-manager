/* global Map, Set, WeakMap */

'use strict';

const DefaultError = Error;
const defineProperty = Object.defineProperty;
const defineProperties = Object.defineProperties;
const enumerable = true;
const freeze = Object.freeze;
const isArray = Array.isArray;

const NL = 1;
const CR = 2;
const CW = 4;
const PR = 8;
const PW = 16;
const EX = 32;

const CODES = [];
CODES[NL] = 'NL';
CODES[CR] = 'CR';
CODES[CW] = 'CW';
CODES[EX] = 'EX';
CODES[PR] = 'PR';
CODES[PW] = 'PW';

const COMPATIBILITIES = [];
COMPATIBILITIES[NL] = CR | CW | EX | NL | PR | PW;
COMPATIBILITIES[CR] = CR | CW | NL | PR | PW;
COMPATIBILITIES[CW] = CR | CW | NL;
COMPATIBILITIES[PR] = CR | NL | PR;
COMPATIBILITIES[PW] = CR | NL;
COMPATIBILITIES[EX] = NL;

const ESCALATIONS = [];
ESCALATIONS[CR] = CR;
ESCALATIONS[CW] = CW;
ESCALATIONS[EX] = CW;
ESCALATIONS[NL] = NL;
ESCALATIONS[PR] = CR;
ESCALATIONS[PW] = CW;

const MODES = [EX, PW, PR, CW, CR, NL];

const TYPES = [];
TYPES[CR] = 'Concurrent Read';
TYPES[CW] = 'Concurrent Write';
TYPES[EX] = 'Exclusive';
TYPES[NL] = 'Null';
TYPES[PR] = 'Protected Read';
TYPES[PW] = 'Protected Write';

const equals = (left, right) => left === right;
const is = type => value => typeof value === type;
const isDefined = value => value !== undefined;
const isFunction = is('function');
const isInteger = value => Number.isSafeInteger(value);
const isKnownMode = value => isDefined(CODES[value]);
const isNotEmpty = value => value.length > 0;
const isNonNegativeInteger = value => isInteger(value) && value >= 0;
const isObject = is('object');
const isString = is('string');
const noop = () => {};

const bags = new WeakMap;

function validate(name, type, value, validator) {
  if (!validator(value)) {
    throw new TypeError(`Argument "${name}" should be ${type}`);
  }
  return value;
}

function validateKey(delimiter, key, name = 'key') {
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

function parseKey(delimiter, key, mode, owner) {
  return {
    key: validateKey(delimiter, key),
    mode,
    owner
  };
}

function parseLock(delimiter, lock, mode, owner) {
  return {
    key: validateKey(delimiter, lock.key, 'lock.key'),
    mode: isDefined(lock.mode)
      ? validate('lock.mode', 'known lock mode', lock.mode, isKnownMode)
      : mode,
    owner: isDefined(lock.owner)
      ? lock.owner
      : owner
  };
}

function parse(delimiter, item, mode, owner) {
  return isObject(item)
    ? parseLock(delimiter, item, mode, owner)
    : parseKey(delimiter, item, mode, owner);
}

function* spawn(delimiter, key, mode, owner) {
  const modes = [];
  for (const priority of MODES) {
    if (priority & mode) modes.push(priority);
  }
  validate('mode', 'known lock mode', modes, isNotEmpty);
  mode = modes.shift();
  const locks = isArray(key)
    ? key.map(item => parse(delimiter, item, mode, owner))
    : [parse(delimiter, key, mode, owner)];
  yield locks;
  while (modes.length) {
    mode = modes.shift();
    for (let i = locks.length; --i >= 0;) {
      locks[i].mode = mode;
    }
    yield locks;
  }
}

class Lock {
  constructor(key, mode, owner, parent, primary) {
    defineProperties(this, {
      key: { enumerable, value: key },
      mode: { enumerable, value: mode },
      owner: { enumerable, value: owner },
      parent: { value: parent },
      primary: { value: primary }
    });
  }

  get code() {
    return CODES[this.mode];
  }

  get type() {
    return TYPES[this.mode];
  }

  toString() {
    const { mode, owner } = this;
    return owner == null
      ? `Lock of "${this.key}" for "${TYPES[mode]}"`
      : `Lock of "${this.key}" by "${owner}" for "${TYPES[mode]}"`;
  }
}

class LockList {
  constructor(config, key, parent) {
    this.config = config;
    this.key = key;
    this.locks = [];
    this.parent = parent;
  }

  acquire(lock) {
    const { config: { comparer }, key, locks } = this;
    const { mode, owner } = lock;
    const compatibility = COMPATIBILITIES[mode];
    for (const existing of locks) {
      if (existing.primary && existing.mode === mode && comparer(existing.owner, owner)) return existing;
      if (!(compatibility & existing.mode)) return null;
    }
    let { parent } = this;
    if (parent) {
      parent = parent.capture(ESCALATIONS[mode], owner);
      if (!parent) return null;
    }
    const acquired = new Lock(key, mode, owner, parent, true);
    locks.push(acquired);
    bags.set(acquired, { pending: true, timeout: 0, timer: 0 });
    return acquired;
  }

  capture(mode, owner) {
    const { key, locks } = this;
    const compatibility = COMPATIBILITIES[mode];
    for (const existing of locks) {
      if (!(compatibility & existing.mode)) return null;
    }
    let { parent } = this;
    if (parent) {
      parent = parent.capture(mode, owner);
      if (!parent) return null;
    }
    const captured = new Lock(key, mode, owner, parent, false);
    locks.push(captured);
    return captured;
  }

  prolong(lock) {
    const { config: { releasing, timeout } } = this;
    const bag = bags.get(lock);
    bag.pending = false;
    if (!timeout) return;
    bag.timeout += timeout;
    clearTimeout(bag.timer);
    bag.timer = setTimeout(
      async () => {
        try {
          await releasing([lock]);
          this.remove(lock);
        } catch (e) {
          this.prolong(lock);
        }
      },
      timeout);
  }

  release(lock) {
    const { config: { comparer }, locks } = this;
    const { mode, owner } = lock;
    for (const existing of locks) {
      if (existing.primary && existing.mode === mode && comparer(existing.owner, owner)) {
        const bag = bags.get(existing);
        if (bag.pending) break;
        bag.pending = true;
        clearTimeout(bag.timer);
        return existing;
      }
    }
    return null;
  }

  remove(lock) {
    const { locks, parent } = this;
    for (let i = locks.length; --i >= 0;) {
      if (lock === locks[i]) {
        locks.splice(i, 1);
        break;
      }
    }
    if (parent) parent.remove(lock.parent);
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
    const { config: { acquired, Error, delimiter }, lists } = this;
    for (const locks of spawn(delimiter, key, mode, owner)) {
      const candidates = [];
      let success = true;
      for (const lock of locks) {
        const candidate = this.resolve(lock.key).acquire(lock);
        if (candidate) candidates.push(candidate);
        else {
          success = false;
          break;
        }
      }
      try {
        if (success) {
          await acquired(candidates);
          return candidates;
        }
      } catch (error) {
        success = false;
        throw error;
      } finally {
        const finalize = success ? 'prolong' : 'remove';
        for (const lock of candidates) {
          lists.get(lock.key)[finalize](lock);
        }
      }
    }
    throw new Error('Some of requested locks cannot be acquired');
  }

  lookup(key, predicate) {
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
        keys.push(validateKey(delimiter, key[i], `keys[${i}]`));
      }
    } else {
      keys.push(validateKey(delimiter, key));
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

  async release(key, mode, owner) {
    const { config: { delimiter, releasing }, lists } = this;
    const candidates = [];
    key = key == null
      ? Array.from(lists.keys())
      : key;
    for (const locks of spawn(delimiter, key, mode, owner)) {
      for (const lock of locks) {
        const candidate = this.resolve(lock.key).release(lock);
        if (candidate) candidates.push(candidate);
      }
    }
    if (candidates.length) {
      let success = true;
      try {
        await releasing(candidates);
      } catch (error) {
        success = false;
        throw error;
      } finally {
        const finalize = success ? 'remove' : 'prolong';
        for (const lock of candidates) {
          lists.get(lock.key)[finalize](lock);
        }
      }
    }
    return candidates;
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
}

class LockManager {
  constructor(config = {}) {
    validate('config', 'an object', config, isObject);
    const {
      acquired = noop,
      Error = DefaultError,
      comparer = equals,
      delimiter = '/',
      releasing = noop,
      timeout = 0
    } = config;
    validate('config.acquired', 'a function', acquired, isFunction);
    validate('config.Error', 'error constructor', Error, isFunction);
    validate('config.comparer', 'a function', comparer, isFunction);
    validate('config.delimiter', 'a string', delimiter, isString);
    validate('config.releasing', 'a function', releasing, isFunction);
    validate('config.timeout', 'not negative integer', timeout, isNonNegativeInteger);
    config = Object.freeze({
      acquired, Error, delimiter, comparer, releasing, timeout
    });
    defineProperty(this, 'config', { enumerable, value: config });
    bags.set(this, new LockMap(config));
  }

  get keys() {
    return bags.get(this).keys;
  }

  get locks() {
    return bags.get(this).locks;
  }

  async acquire(key, mode = EX, owner) {
    return await bags.get(this).acquire(key, mode, owner);
  }

  describe(mode, short = false) {
    return (short ? CODES : TYPES)[mode];
  }

  lookup(key, predicate) {
    return bags.get(this).lookup(key, predicate);
  }

  async release(key, mode = EX, owner) {
    return await bags.get(this).release(key, mode, owner);
  }
}

const properties = {
  CODES: { enumerable, value: freeze(MODES.map(mode => CODES[mode])) },
  MODES: { enumerable, value: freeze(MODES) },
  TYPES: { enumerable, value: freeze(MODES.map(mode => TYPES[mode])) }
};
for (const mode of MODES) {
  properties[CODES[mode]] = { enumerable, value: mode };
}

defineProperties(LockManager, properties);

export default LockManager;
