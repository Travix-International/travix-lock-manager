const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;
const { match, spy, stub } = sinon;

global.expect = expect;
global.match = match;
global.spy = spy;
global.stub = stub;

global.LockManager = require('../src/LockManager');
