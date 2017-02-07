'use strict';

const is = type => value => typeof value === type;
const isFunction = is('function');
const isInteger = Number.isSafeInteger;
const isObject = is('object');
const isString = is('string');

function validate(name, type, value, validator) {
  if (isFunction(validator) ? validator(value) : validator) return value;
  throw new TypeError(`Argument "${name}" should be ${type}`);
}

export {
  isFunction,
  isInteger,
  isObject,
  isString,
  validate
};
