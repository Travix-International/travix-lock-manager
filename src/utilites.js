'use strict';

import { CODES, MODES } from './constants';
import Lock from './Lock';

const is = type => value => typeof value === type;
const isArray = Array.isArray;
const isFunction = is('function');
const isInteger = Number.isSafeInteger;
const isObject = is('object');
const isString = is('string');

function validate(name, type, value, validator) {
  if (isFunction(validator) ? validator(value) : validator) return value;
  throw new TypeError(`Argument "${name}" should be ${type}`);
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
        item.mode == null
          ? mode
          : validate('lock.mode', 'known lock mode', item.mode, CODES[item.mode] != null),
        item.owner == null
          ? owner
          : item.owner
      )
    : new Lock(normalize(delimiter, item), mode, owner);
}

function *spawn(delimiter, key, mode, owner) {
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
  let locks;
  if (isArray(key)) {
    locks = key.map(item => parse(delimiter, item, mode, owner));
    validate('locks', 'not empty array', locks, locks.length);
  } else {
    locks = [parse(delimiter, key, mode, owner)];
  }
  yield locks;
  while (modes.length) {
    mode = modes.shift();
    for (let i = locks.length; --i >= 0;) {
      locks[i] = new Lock(locks[i].key, mode, owner);
    }
    yield locks;
  }
}

export {
  isArray,
  isFunction,
  isInteger,
  isObject,
  isString,
  normalize,
  spawn,
  validate
};
