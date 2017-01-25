'use strict';

const { CODES, EX, MODES, TYPES } = require('./constants');
const { isFunction, isNonNegativeInteger, isObject, isString, validate } = require('./utilites');
const LockMap = require('./LockMap');

const { defineProperties, defineProperty, freeze } = Object;

const maps = new WeakMap;

const DefaultError = Error;
const defaultCallback = () => {};
const defaultComparer = (owner1, owner2) => owner1 === owner2;

class LockManager {
  constructor(config = {}) {
    validate('config', 'an object', config, isObject);
    const {
      AcquireError = DefaultError,
      comparer = defaultComparer,
      delimiter = '/',
      onacquire = defaultCallback,
      onerror = defaultCallback,
      onrelease = defaultCallback,
      timeout = 0
    } = config;
    validate('config.AcquireError', 'error constructor', AcquireError, isFunction);
    validate('config.comparer', 'a function', comparer, isFunction);
    validate('config.delimiter', 'a string', delimiter, isString);
    validate('config.onacquire', 'a function', onacquire, isFunction);
    validate('config.onerror', 'a function', onerror, isFunction);
    validate('config.onrelease', 'a function', onrelease, isFunction);
    validate('config.timeout', 'not negative integer', timeout, isNonNegativeInteger);
    config = freeze({
      AcquireError, comparer, delimiter, onacquire, onerror, onrelease, timeout
    });
    defineProperty(this, 'config', { enumerable: true, value: config });
    maps.set(this, new LockMap(config));
  }

  get keys() {
    return maps.get(this).keys;
  }

  get locks() {
    return maps.get(this).locks;
  }

  acquire(key, mode = EX, owner) {
    return maps.get(this).acquire(key, mode, owner);
  }

  describe(mode, short = false) {
    return (short ? CODES : TYPES)[mode];
  }

  release(key, mode = EX, owner) {
    return maps.get(this).release(key, mode, owner);
  }

  select(key, predicate) {
    return maps.get(this).select(key, predicate);
  }
}

const properties = {
  CODES: { enumerable: true, value: freeze(MODES.map(mode => CODES[mode])) },
  MODES: { enumerable: true, value: freeze(MODES) },
  TYPES: { enumerable: true, value: freeze(MODES.map(mode => TYPES[mode])) }
};
for (const mode of MODES) {
  properties[CODES[mode]] = { enumerable: true, value: mode };
}

defineProperties(LockManager, properties);

module.exports = LockManager;
