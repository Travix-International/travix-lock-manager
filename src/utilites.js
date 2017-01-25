'use strict';

const { CODES, MODES } = require('./constants');
const Lock = require('./Lock');

const is = type => value => typeof value === type;
const isArray = Array.isArray;
const isDefined = value => value !== undefined;
const isFunction = is('function');
const isInteger = value => Number.isSafeInteger(value);
const isKnownMode = value => isDefined(CODES[value]);
const isNotEmpty = value => value.length > 0;
const isNonNegativeInteger = value => isInteger(value) && value >= 0;
const isObject = is('object');
const isString = is('string');

function validate(name, type, value, validator) {
  if (!validator(value)) {
    throw new TypeError(`Argument "${name}" should be ${type}`);
  }
  return value;
}

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

function parse(delimiter, item, mode, owner) {
  return isObject(item)
    ? new Lock(
        normalize(delimiter, item.key, 'lock.key'),
        isDefined(item.mode)
          ? validate('lock.mode', 'known lock mode', item.mode, isKnownMode)
          : mode,
        isDefined(item.owner)
          ? item.owner
          : owner
      )
    : new Lock(normalize(delimiter, item), mode, owner);
}

function *spawn(delimiter, key, mode, owner) {
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
      locks[i] = new Lock(locks[i].key, mode, owner);
    }
    yield locks;
  }
}

module.exports = {
  isArray,
  isDefined,
  isFunction,
  isInteger,
  isKnownMode,
  isNotEmpty,
  isNonNegativeInteger,
  isObject,
  isString,
  normalize,
  spawn,
  validate
};
