import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import 'regenerator-runtime/runtime';

import LockManager from '../src/LockManager';

chai.use(sinonChai);

const { expect } = chai;
const { match, spy } = sinon;

const { CR, CW, EX, NL, PR, PW, CODES, MODES, TYPES } = LockManager;

global.expect = expect;
global.match = match;
global.spy = spy;

global.LockManager = LockManager;
global.CR = CR;
global.CW = CW;
global.EX = EX;
global.NL = NL;
global.PR = PR;
global.PW = PW;
global.CODES = CODES;
global.MODES = MODES;
global.TYPES = TYPES;
