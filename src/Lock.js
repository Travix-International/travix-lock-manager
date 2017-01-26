'use strict';

import { CODES, TYPES } from './constants';

const { defineProperties } = Object;
const enumerable = true;

class Lock {
  constructor(key, mode, owner, primary = true) {
    defineProperties(this, {
      key: { enumerable, value: key },
      mode: { enumerable, value: mode },
      owner: { enumerable, value: owner },
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
    const { key, owner, type } = this;
    return owner == null
      ? `Lock of "${key}" for "${type}"`
      : `Lock of "${key}" for "${type}" by "${owner}"`;
  }
}

export default Lock;
