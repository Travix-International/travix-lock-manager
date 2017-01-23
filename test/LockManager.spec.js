/* global Promise, Set */
/* eslint no-unused-expressions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import LockManagerClass from '../src/LockManager.js';

chai.use(sinonChai);

const { expect } = chai;
const { match, spy } = sinon;

const LockManager = LockManagerClass; // for better readability of specs
const { CR, CW, EX, NL, PR, PW } = LockManager;
const { CODES, MODES, TYPES } = LockManager;

const ERROR = 'Test';

const delay = duration => new Promise(
  resolve => setTimeout(resolve, duration)
);

class TestError extends Error {
  constructor() {
    super(ERROR);
  }
}

describe('LockManager', () => {
  it('is a function', () =>
    expect(LockManager).to.be.a('function')
  );
});

describe('new LockManager', () => {
  it('returns instance of LockManager', () =>
    expect(new LockManager).to.be.instanceOf(LockManager)
  );
});

describe('new LockManager(config)', () => {
  it('throws if config is not an object', () => {
    const operation = () => new LockManager(null);
    expect(operation).to.throw(TypeError);
  });
});

describe('new LockManager(config:object)', () => {
  let acquired;
  const delimiter = '/';
  let comparer;
  let manager;
  let releasing;
  const timeout = 25;

  function failableSpy() {
    const result = spy(() => {
      if (result.fail) throw new Error(ERROR);
    });
    result.fail = false;
    return result;
  }

  beforeEach(() => {
    acquired = failableSpy();
    comparer = spy((left, right) => left === right);
    releasing = failableSpy();
    manager = new LockManager({
      acquired, comparer, delimiter, Error: TestError, releasing, timeout
    });
  });

  it('returns instance of LockManager', () =>
    expect(new LockManager({})).to.be.instanceOf(LockManager)
  );

  it('throws if config.acquired is not a function', () => {
    const operation = () => new LockManager({ acquired: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('calls config.acquired with array containing acquired lock', async () => {
    const locks = await manager.acquire('key', EX, 'owner');
    expect(acquired).to.have.been.calledWith(locks);
  });

  it('does not call config.acquired when lock was not acquired', async () => {
    await manager.acquire('key', EX, 'owner');
    try {
      await manager.acquire('key', PW, 'owner');
    } catch (error) {
      expect(acquired).to.have.been.calledOnce;
    }
  });

  it('calls config.acquired with array containing existing lock when it is reacquired', async () => {
    await manager.acquire('key', EX, 'owner');
    const locks = await manager.acquire('key', EX, 'owner');
    expect(acquired).to.have.been.calledWith(locks);
  });

  it('rejects with error thrown by config.acquired when acquiring lock', async () => {
    acquired.fail = true;
    try {
      expect(await manager.acquire('key', EX)).to.not.be.ok;
    } catch (error) {
      expect(error.message).to.equal(ERROR);
    }
  });

  it('cancels acquire operation if config.acquired throws', async () => {
    acquired.fail = true;
    try {
      expect(await manager.acquire('key', EX)).to.not.be.ok;
    } catch (error) {
      expect(manager.locks).to.be.empty;
    }
  });

  it('throws if config.comparer is not a function', () => {
    const operation = () => new LockManager({ comparer: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('calls config.comparer to compare owners', async () => {
    await manager.acquire('key', NL, 'owner1');
    await manager.acquire('key', NL, 'owner2');
    expect(comparer).to.be.calledWith('owner1', 'owner2');
  });

  it('if config.comparer is not passed uses equality to compare owners', async () => {
    const defaultManager = new LockManager;
    const [lock1] = await defaultManager.acquire('key', NL, 'owner');
    const [lock2] = await defaultManager.acquire('key', NL, 'owner');
    expect(lock1).to.equal(lock2);
  });

  it('throws if config.delimiter is not a string', () => {
    const operation = () => new LockManager({ delimiter: null });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.Error is not a function', () => {
    const operation = () => new LockManager({ Error: null });
    expect(operation).to.throw(TypeError);
  });

  it('rejects with instance of config.Error when fails to acquire lock', async () => {
    await manager.acquire('key', EX, 'owner1');
    try {
      expect(await manager.acquire('key', EX, 'owner2')).to.not.be.ok;
    } catch (error) {
      expect(error.message).to.equal(ERROR);
    }
  });

  it('throws if config.releasing is not a function', () => {
    const operation = () => new LockManager({ releasing: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('calls config.releasing when expired lock is being released', async () => {
    const [lock] = await manager.acquire('key', PW, 'owner');
    await delay(timeout);
    expect(releasing).to.have.been.calledWith(match([match(lock)]));
  });

  it('does not call config.releasing when lock was not released', async () => {
    try {
      await manager.release('key', PW, 'owner');
    } catch (error) {
      expect(acquired).to.not.have.been.called;
    }
  });

  it('rejects with error thrown by config.releasing when releasing lock', async () => {
    releasing.fail = true;
    await manager.acquire('key');
    try {
      expect(await manager.release('key')).to.not.be.ok;
    } catch (error) {
      expect(error.message).to.equal(ERROR);
    }
  });

  it('cancels release operation if config.releasing throws', async () => {
    releasing.fail = true;
    const [lock] = await manager.acquire('key');
    try {
      expect(await manager.release('key')).to.not.be.ok;
    } catch (error) {
      expect(manager.locks).to.contain(lock);
    }
  });

  it('throws if config.timeout is not a number', () => {
    const operation = () => new LockManager({ timeout: null });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.timeout is a negative number', () => {
    const operation = () => new LockManager({ timeout: -1 });
    expect(operation).to.throw(TypeError);
  });

  it('removes acquired lock after timeout', async () => {
    await manager.acquire('key', EX);
    await delay(timeout);
    expect(manager.locks).to.be.empty;
  });

  describe('.acquire()', () => {
    it('rejects if called without arguments', async () => {
      try {
        expect(await manager.acquire()).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.acquire(key:string)', async () => {
    it('rejects if key is not a string or array of strings or object or array of objects', async () => {
      try {
        expect(await manager.acquire(42)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('removes leading and trailing config.delimiter from the key', async () => {
      const [lock] = await manager.acquire(delimiter + 'key' + delimiter + delimiter);
      expect(lock).to.have.property('key').which.equal('key');
    });
  });

  describe('.acquire(key:string, mode)', () => {
    it('rejects if mode is omitted', async () => {
      try {
        expect(await manager.acquire('')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if mode is not a number', async () => {
      try {
        expect(await manager.acquire('', '')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if mode is not positive number', async () => {
      try {
        expect(await manager.acquire('', -1)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.acquire(key:string, mode:number)', () => {
    it('resolves with array containing new lock for specified key and mode', async () => {
      const locks = await manager.acquire('key', EX);
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: EX, owner: undefined }
        ]);
    });

    it('resolves with array containing existing lock when invoked twice with the same arguments', async () => {
      const [first] = await manager.acquire('key', EX);
      const [second] = await manager.acquire('key', EX);
      expect(first).to.equal(second);
    });

    it('resolves with array containing new most restrictive available lock for specified key and mode combined from two flags', async () => {
      const locks = await manager.acquire('key', CR | CW);
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: CW, owner: undefined }
        ]);
    });

    it('captures CR lock on parent key when acuired lock mode is CR', async () => {
      await manager.acquire('parent/child', CR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    });

    it('captures CR lock on parent key when acuired lock mode is PR', async () => {
      await manager.acquire('parent/child', PR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    });

    it('captures CW lock on parent key when acuired lock mode is CW', async () => {
      await manager.acquire('parent/child', CW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('captures CW lock on parent key when acuired lock mode is EX', async () => {
      await manager.acquire('parent/child', EX);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('captures CW lock on parent key when acuired lock mode is PW', async () => {
      await manager.acquire('parent/child', PW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('captures NL lock on parent key when acuired lock mode is NL', async () => {
      await manager.acquire('parent/child', NL);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: NL, owner: undefined }
      ]);
    });

    it('prolongs lifespan of reacquired lock', async () => {
      const [lock] = await manager.acquire('key', EX);
      await delay(timeout / 2);
      await manager.acquire('key', EX);
      await delay(timeout / 2);
      expect(manager.locks).to.contain(lock);
    });

    it('rejects if acquired lock conflicts on same level', async () => {
      await manager.acquire('key', EX);
      try {
        expect(await manager.acquire('key', PW)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if acquired lock conflicts on parent level', async () => {
      await manager.acquire('parent', EX);
      try {
        expect(await manager.acquire('parent/child', PW)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if acquired lock conflicts on ancestor level', async () => {
      await manager.acquire('ancestor', EX);
      try {
        expect(await manager.acquire('ancestor/parent/child', PW)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.acquire(key:string, mode:number, owner)', () => {
    it('resolves with array containing new lock for specified key, mode and owner', async () => {
      const locks = await manager.acquire('key', PR, 'owner');
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: PR, owner: 'owner' }
        ]);
    });

    it('resolves with array containing new most restrictive lock for specified key and mode combined from two flags', async () => {
      await manager.acquire('key', PW, 'owner1');
      const locks = await manager.acquire('key', CR | PW, 'owner2');
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: CR, owner: 'owner2' }
        ]);
    });

    it('rejects if acquired lock conflicts on same level', async () => {
      await manager.acquire('key', EX, 'owner1');
      try {
        expect(await manager.acquire('key', EX, 'owner2')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if acquired lock conflicts on parent level', async () => {
      await manager.acquire('parent', EX, 'owner1');
      try {
        expect(await manager.acquire('parent/child', EX, 'owner2')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if acquired lock conflicts on ancestor level', async () => {
      await manager.acquire('ancestor', EX, 'owner1');
      try {
        expect(await manager.acquire('ancestor/parent/child', EX, 'owner2')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.acquire(keys:string[], mode:number)', () => {
    it('resolves with array containing two new locks for specified keys and mode', async () => {
      const locks = await manager.acquire(['key1', 'key2'], EX);
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: EX, owner: undefined },
          { key: 'key2', mode: EX, owner: undefined }
        ]);
    });
  });

  describe('.acquire(keys:string[], mode:number, owner)', () => {
    it('cancels operation if at least one lock being acquired conflicts with existing', async () => {
      await manager.acquire('key1', EX, 'owner1');
      try {
        expect(await manager.acquire(['key1', 'key2'], EX, 'owner2')).to.be.not.ok;
      } catch (error) {
        expect(manager.locks).to.have.length(2);
      }
    });
  });

  describe('.acquire(lock:object)', () => {
    it('rejects if lock.key is not string', async () => {
      try {
        expect(await manager.acquire({ key: 42 })).to.be.not.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if lock.mode is not known mode', async () => {
      try {
        expect(await manager.acquire({ key: 'key', mode: 3 })).to.be.not.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('resolves with array containing new lock for specified lock.key, lock.mode and lock.owner', async () => {
      const locks = await manager.acquire({ key: 'key', mode: EX, owner: 'owner' });
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: EX, owner: 'owner' }
        ]);
    });
  });

  describe('.acquire(locks:object[])', () => {
    it('rejects if locks[].key is not string', async () => {
      try {
        expect(await manager.acquire([{ key: 42 }])).to.be.not.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('rejects if locks[].mode is not known mode', async () => {
      try {
        expect(await manager.acquire([{ key: 'key', mode: 3 }])).to.be.not.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('resolves with array containing new locks for specified locks[].key, locks[].mode and locks[].owner', async () => {
      const locks = await manager.acquire([
        { key: 'key1', mode: CR, owner: 'owner1' },
        { key: 'key2', mode: CW, owner: 'owner2' }
      ]);
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: CR, owner: 'owner1' },
          { key: 'key2', mode: CW, owner: 'owner2' }
        ]);
    });
  });

  describe('.acquire(lock:object, mode:number)', () => {
    it('resolves with array containing new lock for specified mode if lock.mode is not defined', async () => {
      const locks = await manager.acquire({ key: 'key' }, EX);
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: EX, owner: undefined }
        ]);
    });

    it('resolves with array containing new lock for specified lock.mode if it is defined', async () => {
      const locks = await manager.acquire({ key: 'key', mode: EX }, NL);
      expect(locks).to.be.an('array')
        .and.have.length(1)
        .and.deep.include.members([
          { key: 'key', mode: EX, owner: undefined }
        ]);
    });
  });

  describe('.acquire(locks:object[], mode:number)', () => {
    it('resolves with array containing new locks for specified mode if locks[].mode is not defined', async () => {
      const locks = await manager.acquire([{ key: 'key1' }, { key: 'key2' }], EX);
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: EX, owner: undefined },
          { key: 'key2', mode: EX, owner: undefined }
        ]);
    });

    it('resolves with array containing new locks for specified locks[].mode if it is defined', async () => {
      const locks = await manager.acquire([
        { key: 'key1', mode: CR },
        { key: 'key2', mode: CW }
      ], NL);
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: CR, owner: undefined },
          { key: 'key2', mode: CW, owner: undefined }
        ]);
    });
  });

  describe('.acquire(locks:object[], mode:number, owner)', () => {
    it('resolves with array containing new locks for specified owner if locks[].owner is not defined', async () => {
      const locks = await manager.acquire([{ key: 'key1' }, { key: 'key2' }], EX, 'owner');
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: EX, owner: 'owner' },
          { key: 'key2', mode: EX, owner: 'owner' }
        ]);
    });

    it('resolves with array containing new locks for specified locks[].owner if it is defined', async () => {
      const locks = await manager.acquire([
        { key: 'key1', mode: CR, owner: 'owner1' },
        { key: 'key2', mode: CW, owner: 'owner2' }
      ], NL);
      expect(locks).to.be.an('array')
        .and.have.length(2)
        .and.deep.include.members([
          { key: 'key1', mode: CR, owner: 'owner1' },
          { key: 'key2', mode: CW, owner: 'owner2' }
        ]);
    });
  });

  describe('.describe()', () => {
    it('returns undefined', () =>
      expect(manager.describe()).to.be.undefined
    );
  });

  describe('.describe(mode)', () => {
    it('returns long description for known modes', () =>
      MODES.forEach(mode =>
        expect(manager.describe(mode)).to.be.a('string').and.have.length.above(2)
      )
    );

    it('returns short description for known modes', () =>
      MODES.forEach(mode =>
        expect(manager.describe(mode, true)).to.be.a('string').and.have.length(2)
      )
    );

    it('returns undefined for unknown mode', () =>
      expect(manager.describe(-1)).to.be.undefined
    );
  });

  describe('.keys', () => {
    it('is empty array initially', () =>
      expect(manager.keys).to.be.an('array').and.be.empty);

    it('contains hierarchy of acquired keys', async () => {
      await manager.acquire('ancestor/parent/child', EX);
      expect(manager.keys).to.include.members([
        '', 'ancestor', 'ancestor/parent', 'ancestor/parent/child'
      ]);
    });

    it('does not contain hierarchy of released keys', async () => {
      await manager.acquire(['a', 'b'], EX);
      await manager.release('a', EX);
      expect(manager.keys).to.not.include.members(['a']);
    });
  });

  describe('.locks', () => {
    it('is empty array initially', () =>
      expect(manager.locks).to.be.an('array').and.be.empty);
  });

  describe('.release()', () => {
    it('throws if called without arguments', async () => {
      try {
        expect(await manager.release()).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.lookup', () => {
    it('is a function', () =>
      expect(manager.lookup).to.be.a('function')
    );
  });

  describe('.lookup()', () => {
    it('returns empty set if nothing is locked', () =>
      expect(manager.lookup()).to.be.instanceof(Set)
        .and.have.property('size').which.equal(0)
    );

    it('returns set containing locks hierarchy', async () => {
      await manager.acquire('ancestor/parent/child', EX, 'owner');
      expect(Array.from(manager.lookup())).to.deep.include.members([
          { key: 'ancestor', mode: CW, owner: 'owner' },
          { key: 'ancestor/parent', mode: CW, owner: 'owner' },
          { key: 'ancestor/parent/child', mode: EX, owner: 'owner' }
        ]);
    });
  });

  describe('.lookup(key)', () => {
    it('throws if key is not string or array of strings', () =>
      expect(() => manager.lookup(42)).to.throw
    );
  });

  describe('.lookup(key:string)', () => {
    it('returns empty set if specified key was not locked', async () => {
      await manager.acquire('a');
      expect(manager.lookup('b')).to.be.instanceof(Set)
        .and.have.property('size').which.equal(0);
    });

    it('returns set containing lock data for specified key and its ancestors only if it was locked', async () => {
      await manager.acquire(['key1', 'key2'], PW, 'owner');
      () => expect(Array.from(manager.lookup('key1'))).to.not.deep.include.members([
        { key: 'key2', mode: PW, owner: 'owner' },
        { key: '', mode: CW, owner: 'owner' }
      ]);
    });
  });

  describe('.lookup(key:string[])', () => {
    it('returns set containing locks for specified keys only', async () => {
      await manager.acquire(['a', 'b', 'c']);
      expect(Array.from(manager.lookup(['a', 'b']))).to.deep.include.members([
        { key: 'a', mode: EX, owner: undefined },
        { key: 'b', mode: EX, owner: undefined }
      ]).and.not.deep.include.members([
        { key: 'c', mode: EX, owner: undefined }
      ]);
    });
  });

  describe('.lookup(predicate:function)', () => {
    it('returns set containing only locks satisfying predicate', async () => {
      await manager.acquire(['a', 'b', 'c']);
      expect(Array.from(manager.lookup(lock => lock.key === 'a'))).to.deep.include.members([
        { key: 'a', mode: EX, owner: undefined }
      ]).and.not.deep.include.members([
        { key: 'b', mode: EX, owner: undefined },
        { key: 'c', mode: EX, owner: undefined }
      ]);
    });
  });

  describe('.lookup(key:string, predicate)', () => {
    it('throws if predicate is not a function', () =>
      expect(() => manager.lookup('', 42)).to.throw
    );
  });

  describe('.release(key)', async () => {
    it('throws if key is not a string or array of strings or object or array of objects', async () => {
      try {
        expect(await manager.release(42)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('.release(key:string, mode)', () => {
    it('throws if mode is omitted', async () => {
      try {
        expect(await manager.release('')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('throws if mode is not a number', async () => {
      try {
        expect(await manager.release('', '')).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });

    it('throws if mode is not positive number', async () => {
      try {
        expect(await manager.release('', -1)).to.not.be.ok;
      } catch (error) {
        expect(error).to.be.ok;
      }
    });
  });

  describe('Lock', () => {
    describe('.code', () => {
      it('returns short (two-letter) description of the lock mode', async () => {
        for (let i = MODES.length; --i >= 0;) {
          const code = CODES[i];
          const mode = MODES[i];
          const [lock] = await manager.acquire(code, mode);
          expect(lock.code).to.be.a('string')
            .and.equal(code);
        }
      });
    });

    describe('.type', () => {
      it('returns long description of the lock mode', async () => {
        for (let i = MODES.length; --i >= 0;) {
          const mode = MODES[i];
          const type = TYPES[i];
          const [lock] = await manager.acquire(type, mode);
          expect(lock.type).to.be.a('string')
            .and.equal(type);
        }
      });
    });

    describe('.toString()', () => {
      it('returns string containing lock key and type if owner is not specified', async () => {
        const key = 'key', mode = EX;
        const [lock] = await manager.acquire('key', EX);
        expect(lock.toString()).to.be.a('string')
          .and.contain(key)
          .and.contain(manager.describe(mode));
      });

      it('returns string containing lock key, type and owner if owner is specified', async () => {
        const key = 'key', mode = EX, owner = 'owner';
        const [lock] = await manager.acquire('key', EX, 'owner');
        expect(lock.toString()).to.be.a('string')
          .and.contain(key)
          .and.contain(manager.describe(mode))
          .and.contain(owner);
      });
    });
  });
});
