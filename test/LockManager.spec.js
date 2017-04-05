'use strict';

class AcquireError extends Error {
  constructor(message, locks) {
    super(message);
    this.locks = locks;
  }
}

function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

describe('LockManager', () => {
  it('is a function', () =>
    expect(LockManager).to.be.a('function')
  );
});

describe('new LockManager', () => {
  it('creates new instance of LockManager', () => {
    expect(new LockManager).to.be.instanceof(LockManager)
  });
});

describe('new LockManager(config)', () => {
  it('throws if config is not an object', () => {
    const operation = () => new LockManager(null);
    expect(operation).to.throw(TypeError);
  });
});

describe('new LockManager(config:object)', () => {
  it('creates new instance of LockManager', () => {
    expect(new LockManager({})).to.be.instanceof(LockManager)
  });

  it('throws if config.AcquireError is not a function', () => {
    const operation = () => new LockManager({ AcquireError: 42 });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.comparer is not a function', () => {
    const operation = () => new LockManager({ comparer: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.delimiter is not a string', () => {
    const operation = () => new LockManager({ delimiter: null });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.onacquire is not a function', () => {
    const operation = () => new LockManager({ onacquire: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.onrelease is not a function', () => {
    const operation = () => new LockManager({ onrelease: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.timeout is not a number', () => {
    const operation = () => new LockManager({ timeout: null });
    expect(operation).to.throw(TypeError);
  });

  it('throws if config.timeout is a negative number', () => {
    const operation = () => new LockManager({ timeout: -1 });
    expect(operation).to.throw(TypeError);
  });

  describe('.acquire()', () => {
    it('resolves to an empty array', async () => {
      const manager = new LockManager;
      const locks = await manager.acquire();
      expect(locks).to.be.empty;
    });
  });

  describe('.acquire(key)', async () => {
    it('eventually throws TypeError if key is not a string or array of strings or object or array of objects', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire(42);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });
  });

  describe('.acquire(key:string)', async () => {
    it('works empty delimiter', async () => {
      const manager = new LockManager({ delimiter: '' });
      const key = 'solid / key';
      const [lock] = await manager.acquire(key);
      expect(lock).to.have.property('key', key);
    });

    it('removes leading and trailing delimiter from the key', async () => {
      const delimiter = '|';
      const manager = new LockManager({ delimiter });
      const [lock] = await manager.acquire(delimiter + 'key' + delimiter + delimiter);
      expect(lock).to.have.property('key', 'key');
    });

    it('automatically releases lock on timeout', async () => {
      /*
      function delay(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
      */
      const timeout = 10;
      const manager = new LockManager({ timeout });
      await manager.acquire('key');
      await delay(timeout);
      expect(manager.locks).to.be.empty;
    });

    it('calls onrelease handler when expired lock is released on timeout', async () => {
      const onrelease = spy();
      const timeout = 10;
      const manager = new LockManager({ onrelease, timeout });
      const [lock] = await manager.acquire('key');
      await delay(timeout);
      expect(onrelease).to.have.been.calledOnce.and.calledWithMatch([lock]);
    });

    it('prolongs lifespan of re-acquired lock', async () => {
      const timeout = 10;
      const manager = new LockManager({ timeout });
      const [lock] = await manager.acquire('key');
      await delay(timeout / 2);
      await manager.acquire('key');
      await delay(timeout / 2);
      expect(manager.locks).to.contain(lock);
    });

    it('calls onacquire handler once passing array containing acquired lock', async () => {
      const onacquire = spy();
      const manager = new LockManager({ onacquire });
      const locks = await manager.acquire('key');
      expect(onacquire).to.have.been.calledOnce.and.calledWith(locks);
    });

    it('calls onacquire handler with array containing existing lock if it has been re-acquired', async () => {
      const onacquire = spy();
      const manager = new LockManager({ onacquire });
      await manager.acquire('key');
      const locks = await manager.acquire('key');
      expect(onacquire).to.have.been.calledTwice.and.calledWithExactly(locks);
    });

    it('eventually throws error thrown by onacquire handler', async () => {
      const handlerError = new Error;
      const onacquire = stub().throws(handlerError);
      const manager = new LockManager({ onacquire });
      let error;
      try {
        await manager.acquire('key');
      } catch (e) {
        error = e;
      }
      expect(error).to.equal(handlerError);
    });

    it('cancels acquire operation, if onacquire handler throws an error', async () => {
      const onacquire = stub().throws();
      const manager = new LockManager({ onacquire });
      try {
        await manager.acquire('key');
      } catch (e) {
        // continue
      }
      expect(manager.locks).to.be.empty;
    });

    it('extends expired lock if onrelease handler throws', async () => {
      const timeout = 10;
      const suppress = spy();
      process.addListener('unhandledRejection', suppress);
      const onrelease = stub().throws();
      const manager = new LockManager({ onrelease, timeout });
      const [lock] = await manager.acquire('key');
      await delay(timeout);
      const extended = manager.locks;
      onrelease.returns();
      await delay(timeout);
      const expired = manager.locks;
      process.removeListener('unhandledRejection', suppress);
      expect(extended).to.contain(lock);
      expect(expired).to.not.contain(lock);
    });
  });

  describe('.acquire(key:string, mode)', () => {
    it('eventually throws TypeError if mode is not a number', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire('', '');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });

    it('eventually throws TypeError if mode is unknown', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire('', -1);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });
  });

  describe('.acquire(key:string, mode:number)', () => {
    it('eventually returns array containing new lock for specified key and mode', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', EX);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: EX, owner: undefined }
      ]);
    });

    it('eventually returns array containing existing lock if it has not expired', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const [first] = await manager.acquire('key', EX);
      const [second] = await manager.acquire('key', EX);
      expect(first).to.equal(second);
    });

    it('eventually returns array containing new most restrictive available lock for specified key and combination of modes', async () => {
      const { CR, CW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', CR | CW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: CW, owner: undefined }
      ]);
    });

    it('eventually captures CR lock on the parent key when requested lock mode is CR', async () => {
      const { CR } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', CR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    });

    it('eventually captures CR lock on the parent key when requested lock mode is PR', async () => {
      const { CR, PR } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', PR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    });

    it('eventually captures CW lock on the parent key when acuired lock mode is CW', async () => {
      const { CW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', CW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('eventually captures CW lock on the parent key when acuired lock mode is EX', async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', EX);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('eventually captures CW lock on parent key when acuired lock mode is PW', async () => {
      const { CW, PW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', PW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    });

    it('eventually captures NL lock on parent key when acuired lock mode is NL', async () => {
      const { NL } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', NL);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: NL, owner: undefined }
      ]);
    });

    it('does not call onacquire handler if lock has not been acquired', async () => {
      const { EX, PW } = LockManager;
      const onacquire = spy();
      const manager = new LockManager({ onacquire });
      const locks = await manager.acquire('key', EX);
      try {
        await manager.acquire('key', PW);
      } catch (e) {
        // continue
      }
      expect(onacquire).to.have.been.calledOnce.and.calledWith(locks);
    });

    it('eventually throws AcquireError initialized with array of locks conflicting on the same level', async () => {
      /*
      class AcquireError extends Error {
        constructor(message, locks) {
          super(message);
          this.locks = locks;
        }
      }
      */
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('parent/child', EX);
      let error;
      try {
        await manager.acquire('parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'parent/child', mode: EX, owner: undefined }, key: 'parent/child', mode: PW, owner: undefined }
      ]);
    });

    it('eventually throws AcquireError initialized with array of locks conflicting on the parent level', async () => {
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('parent', EX);
      let error;
      try {
        await manager.acquire('parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'parent', mode: EX, owner: undefined }, key: 'parent/child', mode: PW, owner: undefined }
      ]);
    });

    it('eventually throws AcquireError initialized with array of locks conflicting on the ancestor level', async () => {
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('ancestor', EX);
      let error;
      try {
        await manager.acquire('ancestor/parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'ancestor', mode: EX, owner: undefined }, key: 'ancestor/parent/child', mode: PW, owner: undefined }
      ]);
    });
  });

  describe('.acquire(key:string, mode:number, owner)', () => {
    it('uses configured comparer to compare owners', async () => {
      const { NL } = LockManager;
      const comparer = spy((owner1, owner2) => owner1 === owner2);
      const manager = new LockManager({ comparer });
      await manager.acquire('key', NL, 'owner1');
      await manager.acquire('key', NL, 'owner2');
      expect(comparer).to.be.calledWith('owner1', 'owner2');
    });

    it('uses strict equality to compare owners if comparer is not configured', async () => {
      const { NL } = LockManager;
      const manager = new LockManager;
      const [lock1] = await manager.acquire('key', NL, 'owner');
      const [lock2] = await manager.acquire('key', NL, 'owner');
      expect(lock1).to.equal(lock2);
    });

    it('eventually returns array containing new lock for specified key, mode and owner', async () => {
      const { PR } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', PR, 'owner');
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PR, owner: 'owner' }
      ]);
    });

    it('eventually returns array containing new most restrictive lock for specified key, combination of modes and owner', async () => {
      const { CR, PW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('key', PW, 'owner1');
      const locks = await manager.acquire('key', CR | PW, 'owner2');
      expect(locks).to.be.an('array').that.deep.equals([
        { key: 'key', mode: CR, owner: 'owner2' }
      ]);
    });

    it('eventually throws AcquireError initalized with array of locks conflicting on the same level', async () => {
      const { EX } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('key', EX, 'owner1');
      let error;
      try {
        await manager.acquire('key', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'key', mode: EX, owner: 'owner1' }, key: 'key', mode: EX, owner: 'owner2' }
      ]);
    });

    it('eventually throws AcquireError initalized with array of locks conflicting on the parent level', async () => {
      const { EX } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('parent', EX, 'owner1');
      let error;
      try {
        await manager.acquire('parent/child', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'parent', mode: EX, owner: 'owner1' }, key: 'parent/child', mode: EX, owner: 'owner2' }
      ]);
    });

    it('eventually throws AcquireError initalized with array of locks conflicting on the ancestor level', async () => {
      const { EX } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('ancestor', EX, 'owner1');
      let error;
      try {
        await manager.acquire('ancestor/parent/child', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'ancestor', mode: EX, owner: 'owner1' }, key: 'ancestor/parent/child', mode: EX, owner: 'owner2' }
      ]);
    });
  });

  describe('.acquire(keys:string[], mode:number)', () => {
    it('eventually returns array containing two new locks for specified keys and mode', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire(['key1', 'key2'], EX);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key1', mode: EX, owner: undefined },
        { key: 'key2', mode: EX, owner: undefined }
      ]);
    });

    it('eventually throws AcquireError initalized with array of locks conflicting on the same level', async () => {
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire(['key1', 'key2'], EX, 'owner1');
      let error;
      try {
        await manager.acquire(['key1', 'key2'], EX | PW, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([
        { conflict: { key: 'key1', mode: EX, owner: 'owner1' }, key: 'key1', mode: EX, owner: 'owner2' },
        { conflict: { key: 'key1', mode: EX, owner: 'owner1' }, key: 'key1', mode: PW, owner: 'owner2' }
      ]);
    });
  });

  describe('.acquire(keys:string[], mode:number, owner)', () => {
    it('cancels operation if one of requested locks conflicts with existing one', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('key1', EX, 'owner1');
      try {
        await manager.acquire(['key1', 'key2'], EX, 'owner2');
      } catch (e) {
        // continue
      }
      expect(manager.keys).to.not.include('key2');
    });
  });

  describe('.acquire(lock:object)', () => {
    it('eventually throws TypeError if lock.key is not a string', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire({ key: 42 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });

    it('eventually throws TypeError if lock.mode is not a known mode', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire({ key: 'key', mode: 3 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });

    it('eventually returns array containing new lock for specified lock.key, lock.mode and lock.owner', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key', mode: EX, owner: 'owner' });
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: EX, owner: 'owner' }
      ]);
    });
  });

  describe('.acquire(locks:object[])', () => {
    it('eventually throws TypeError if locks[].key is not string', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire([{ key: 42 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });

    it('rejects throws TypeError if locks[].mode is not known mode', async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire([{ key: 'key', mode: 3 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    });

    it('eventually returns array containing new locks for requested locks[].key, locks[].mode and locks[].owner', async () => {
      const { CR, CW } = LockManager;
      const manager = new LockManager;
      const requested = [
        { key: 'key1', mode: CR, owner: 'owner1' },
        { key: 'key2', mode: CW, owner: 'owner2' }
      ];
      const locks = await manager.acquire(requested);
      expect(locks).to.be.an('array').and.deep.equal(requested);
    });
  });

  describe('.acquire(lock:object, mode:number)', () => {
    it('eventually returns array containing new lock for the requested mode if lock.mode is not defined', async () => {
      const { PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key' }, PW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PW, owner: undefined }
      ]);
    });

    it('eventually returns array containing new lock for the requested lock.mode if it is defined', async () => {
      const { NL, PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key', mode: PW }, NL);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PW, owner: undefined }
      ]);
    });
  });

  describe('.acquire(locks:object[], mode:number)', () => {
    it('eventually returns array containing new locks for the requested mode if locks[].mode is not defined', async () => {
      const { PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire([{ key: 'key1' }, { key: 'key2' }], PW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key1', mode: PW, owner: undefined },
        { key: 'key2', mode: PW, owner: undefined }
      ]);
    });
  });

  describe('.acquire(locks:object[], mode:number, owner)', () => {
    it('eventually returns array containing new locks for requested mode and owner if locks[].mode or locks[].owner are not defined', async () => {
      const { EX, NL, PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire([
        { key: 'key1' },
        { key: 'key2', mode: PW },
        { key: 'key3', owner: 'owner2' },
        { key: 'key4', mode: EX, owner: 'owner3' }
      ], NL, 'owner1');
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key1', mode: NL, owner: 'owner1' },
        { key: 'key2', mode: PW, owner: 'owner1' },
        { key: 'key3', mode: NL, owner: 'owner2' },
        { key: 'key4', mode: EX, owner: 'owner3' }
      ]);
    });
  });

  describe('.describe()', () => {
    it('returns undefined', () => {
      const manager = new LockManager;
      expect(manager.describe()).to.be.undefined
    });
  });

  describe('.describe(mode)', () => {
    it('returns long description for known modes', () => {
      const { MODES } = LockManager;
      const manager = new LockManager;
      for (const mode of MODES) {
        expect(manager.describe(mode)).to.be.a('string').and.have.length.above(2)
      }
    });

    it('returns short description for known modes', () => {
      const { MODES } = LockManager;
      const manager = new LockManager;
      for (const mode of MODES) {
        expect(manager.describe(mode, true)).to.be.a('string').and.have.length(2);
      }
    });

    it('returns undefined for unknown mode', () => {
      const manager = new LockManager;
      expect(manager.describe(-1)).to.be.undefined
    });
  });

  describe('.keys', () => {
    it('gets empty array if no locks were acquired', () => {
      const manager = new LockManager;
      expect(manager.keys).to.be.an('array').and.be.empty;
    });

    it('gets array that contains hierarchy of acquired keys', async () => {
      const manager = new LockManager;
      await manager.acquire('ancestor/parent/child');
      expect(manager.keys).to.include.members([
        '', 'ancestor', 'ancestor/parent', 'ancestor/parent/child'
      ]);
    });

    it('gets array that does not contain hierarchy of released keys', async () => {
      const manager = new LockManager;
      await manager.acquire(['ancestor1/parent1/child1', 'ancestor2/parent2/child2']);
      await manager.release('ancestor2/parent2/child2');
      expect(manager.keys).to.not.include.members([
        'ancestor2', 'ancestor2/parent2', 'ancestor2/parent2/child2'
      ]);
    });

    it('gets empty array after all locks have been released', async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      await manager.acquire(['key2', 'key3']);
      await manager.release();
      expect(manager.keys).to.be.an('array').and.be.empty;
    });
  });

  describe('.locks', () => {
    it('gets empty array if no locks have been acquired', () => {
      const manager = new LockManager;
      expect(manager.locks).to.be.an('array').and.be.empty;
    });

    it('gets array that contains hierarchy of acquired keys', async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('ancestor/parent/child', EX, 'owner');
      expect(manager.locks).to.be.an('array').and.have.lengthOf(4).and.deep.include.members([
        { key: '', mode: CW, owner: 'owner' },
        { key: 'ancestor', mode: CW, owner: 'owner' },
        { key: 'ancestor/parent', mode: CW, owner: 'owner' },
        { key: 'ancestor/parent/child', mode: EX, owner: 'owner' }
      ]);
    });

    it('gets array that does not contain hierarchy of released keys', async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['ancestor1/parent1/child1', 'ancestor2/parent2/child2'], EX, 'owner');
      await manager.release('ancestor2/parent2/child2', EX, 'owner');
      expect(manager.locks).to.be.an('array').and.have.lengthOf(4).and.not.deep.include.members([
        { key: 'ancestor2', mode: CW, owner: 'owner' },
        { key: 'ancestor2/parent2', mode: CW, owner: 'owner' },
        { key: 'ancestor2/parent2/child2', mode: EX, owner: 'owner' }
      ]);
    });

    it('gets empty array after all locks were released', async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      await manager.acquire(['key2', 'key3']);
      await manager.release();
      expect(manager.locks).to.be.an('array').and.be.empty;
    });
  });

  describe('.release()', () => {
    it('resolves to an empty array if there is nothing to release', async () => {
      const manager = new LockManager;
      const locks = await manager.release();
      expect(locks).to.be.empty;
    });

    it('does not call config.onrelease if there is nothing to release', async () => {
      const onrelease = spy();
      const manager = new LockManager({ onrelease });
      await manager.release();
      expect(onrelease).to.not.have.been.called;
    });

    it('releases all previously acquired keys', async () => {
      const manager = new LockManager;
      const acquired = await manager.acquire(['key1', 'key2']);
      const released = await manager.release();
      expect(released).to.deep.equal(acquired);
    });
  });

  describe('.release(key:string)', () => {
    it('does not release lock again if it waits for onrelease handler to complete', async () => {
      const onrelease = stub().returns(delay(10));
      const manager = new LockManager({ onrelease });
      await manager.acquire('key');
      const released = manager.release('key');
      const retried = manager.release('key');
      expect(await released).to.not.be.empty;
      expect(await retried).to.be.empty;
    });

    it('eventually throws error thrown by onrelease handler', async () => {
      const releaseError = new Error;
      const onrelease = stub().throws(releaseError);
      const manager = new LockManager({ onrelease });
      await manager.acquire('key');
      let error;
      try {
        await manager.release('key');
      } catch (e) {
        error = e;
      }
      expect(error).to.equal(releaseError);
    });

    it('cancels operation if onrelease handler throws', async () => {
      const onrelease = stub().throws();
      const manager = new LockManager({ onrelease });
      const [lock] = await manager.acquire('key');
      try {
        await manager.release('key');
      } catch (e) {
        // continue
      }
      expect(manager.locks).to.contain(lock);
    });
  });

  describe('.release(keys:string[])', () => {
    it('releases specified keys', async () => {
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2', 'key3']);
      await manager.release(['key1', 'key2']);
      expect(manager.keys).to.contain('key3').and.not.contain.members(['key1', 'key2']);
    });
  });

  describe('.select', () => {
    it('is a function', () => {
      const manager = new LockManager;
      expect(manager.select).to.be.a('function')
    });
  });

  describe('.select()', () => {
    it('returns empty set if no locks has been acquired', () => {
      const manager = new LockManager;
      const set = manager.select();
      expect(set).to.be.instanceof(Set).with.property('size', 0);
    });

    it('returns set containing hierarchy of acquired locks', async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('ancestor/parent/child');
      const set = manager.select();
      expect(set).to.be.instanceof(Set).with.property('size', 4);
      expect(Array.from(set)).to.deep.equal([
        { key: '', mode: CW, owner: undefined },
        { key: 'ancestor', mode: CW, owner: undefined },
        { key: 'ancestor/parent', mode: CW, owner: undefined },
        { key: 'ancestor/parent/child', mode: EX, owner: undefined }
      ]);
    });
  });

  describe('.select(key)', () => {
    it('throws TypeError if key is not string or array of strings', () => {
      const manager = new LockManager;
      const operation = () => manager.select(42);
      expect(operation).to.throw(TypeError);
    });
  });

  describe('.select(key:string)', () => {
    it('returns empty set if specified key was not locked', async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      const set = manager.select('key2');
      expect(set).to.be.instanceof(Set).with.property('size', 0);
    });
  });

  describe('.select(key:string[])', () => {
    it('returns set containing locks for specified keys only', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2', 'key3']);
      const set = manager.select(['key1', 'key2']);
      expect(set).to.be.instanceof(Set).with.property('size', 2);
      expect(Array.from(set)).to.deep.equal([
        { key: 'key1', mode: EX, owner: undefined },
        { key: 'key2', mode: EX, owner: undefined }
      ]);
    });
  });

  describe('.select(predicate:function)', () => {
    it('returns set containing only locks satisfying passed predicate', async () => {
      const { CR, PW } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2'], CR);
      await manager.acquire(['key1', 'key2'], PW);
      const predicate = ({ mode }) => mode === PW;
      const set = manager.select(predicate);
      expect(set).to.be.instanceof(Set).with.property('size', 2);
      expect(Array.from(set)).to.deep.equal([
        { key: 'key1', mode: PW, owner: undefined },
        { key: 'key2', mode: PW, owner: undefined }
      ]);
    });
  });

  describe('.select(key:string, predicate)', () => {
    it('throws TypeError if predicate is not a function', () => {
      const manager = new LockManager;
      const operation = () => manager.select('', 42);
      expect(operation).to.throw(TypeError);
    });
  });

  describe('.select(key:string, predicate:function)', () => {
    it('returns set containing only locks for specified key satisfying passed predicate', async () => {
      const { CR, NL } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2'], NL);
      await manager.acquire(['key1', 'key2'], CR);
      const predicate = ({ mode }) => mode === CR;
      const set = manager.select('key1', predicate);
      expect(set).to.be.instanceof(Set).with.property('size', 1);
      expect(Array.from(set)).to.deep.equal([
        { key: 'key1', mode: CR, owner: undefined }
      ]);
    });
  });
});
