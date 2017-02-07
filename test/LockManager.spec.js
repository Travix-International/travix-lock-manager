'use strict';

const delimiter = '/';
const timeout = 10;
const ERROR = 'Test';

let comparer, manager, onacquire, onrelease;

class AcquireError extends Error {
  constructor(message, locks) {
    super(ERROR);
    this.locks = locks;
  }
}

function delay(duration = timeout) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

describe('LockManager', () => {
  it('is a function', () =>
    expect(LockManager).to.be.a('function')
  );
});

describe('new LockManager', () => {
  it('returns instance of LockManager', () =>
    expect(new LockManager).to.be.instanceof(LockManager)
  );
});

describe('new LockManager(config)', () => {
  it('throws if config is not an object', () => {
    const operation = () => new LockManager(null);
    expect(operation).to.throw(TypeError);
  });
});

describe('new LockManager(config:object)', () => {
  afterEach(() => {
    onacquire.fail = false;
    onrelease.fail = false;
  });

  beforeEach(() => {
    comparer = spy((owner1, owner2) => owner1 === owner2);
    onacquire = spy(() => {
      if (onacquire.fail) throw new Error(ERROR);
    });
    onacquire.fail = false;
    onrelease = spy(() => {
      if (onrelease.fail) throw new Error(ERROR);
      if (onrelease.delay) return delay();
    });
    onrelease.delay = false;
    onrelease.fail = false;

    manager = new LockManager({
      AcquireError, comparer, delimiter, onacquire, onrelease, timeout
    });
  });

  it('returns instance of LockManager', () =>
    expect(new LockManager({})).to.be.instanceof(LockManager)
  );

  it('throws if config.AcquireError is not a function', () => {
    const operation = () => new LockManager({ AcquireError: 42 });
    expect(operation).to.throw(TypeError);
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

  it('removes leading and trailing config.delimiter from the key', async () => {
    const [lock] = await manager.acquire(delimiter + 'key' + delimiter + delimiter);
    expect(lock).to.have.property('key').which.equal('key');
  });

  it('accepts empty delimiter', async () => {
    manager = new LockManager({ delimiter: '' });
    const key = 'solid / key';
    const [lock] = await manager.acquire(key);
    expect(lock).to.have.property('key').which.equal(key);
  });

  it('throws if config.onacquire is not a function', () => {
    const operation = () => new LockManager({ onacquire: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('calls config.onacquire with array containing onacquire lock', async () => {
    const locks = await manager.acquire('key', EX, 'owner');
    expect(onacquire).to.have.been.calledWith(locks);
  });

  it('does not call config.onacquire when lock has not been acquired', async () => {
    await manager.acquire('key', EX, 'owner');
    try {
      await manager.acquire('key', PW, 'owner');
    } catch (e) {
      // continue
    }
    expect(onacquire).to.have.been.calledOnce;
  });

  it('calls config.onacquire with array containing existing lock when it is reacquired', async () => {
    await manager.acquire('key', EX, 'owner');
    const locks = await manager.acquire('key', EX, 'owner');
    expect(onacquire).to.have.been.calledWith(locks);
  });

  it('rejects with error thrown by config.onacquire when acquiring lock', async () => {
    onacquire.fail = true;
    let error;
    try {
      await manager.acquire('key', EX);
    } catch (e) {
      error = e;
    }
    expect(error.message).to.equal(ERROR);
  });

  it('cancels acquire operation if config.onacquire throws', async () => {
    onacquire.fail = true;
    try {
      await manager.acquire('key', EX);
    } catch (e) {
      // continue
    }
    expect(manager.locks).to.be.empty;
  });

  it('throws if config.onrelease is not a function', () => {
    const operation = () => new LockManager({ onrelease: 'test' });
    expect(operation).to.throw(TypeError);
  });

  it('calls config.onrelease when expired lock is being released', async () => {
    const [lock] = await manager.acquire('key', PW, 'owner');
    await delay();
    expect(onrelease).to.have.been.calledWith(match([match(lock)]));
  });

  it('does not call config.onrelease when lock has not been released', async () => {
    try {
      await manager.release('key', PW, 'owner');
    } catch (e) {
      // continue
    }
    expect(onrelease).to.not.have.been.called;
  });

  it('rejects with error thrown by config.onrelease when releasing lock', async () => {
    onrelease.fail = true;
    await manager.acquire('key');
    let error;
    try {
      await manager.release('key');
    } catch (e) {
      error = e;
    }
    expect(error.message).to.equal(ERROR);
  });

  it('cancels release operation if config.onrelease throws', async () => {
    onrelease.fail = true;
    const [lock] = await manager.acquire('key');
    try {
      await manager.release('key');
    } catch (e) {
      // continue
    }
    expect(manager.locks).to.contain(lock);
  });

  it('extends expired lock if config.onrelease throws', async () => {
    const suppress = () => {};
    process.addListener('unhandledRejection', suppress);
    onrelease.fail = true;
    const [lock] = await manager.acquire('key');
    await delay();
    const extended = manager.locks;
    onrelease.fail = false;
    await delay();
    const expired = manager.locks;
    process.removeListener('unhandledRejection', suppress);
    expect(extended).to.contain(lock);
    expect(expired).to.not.contain(lock);
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
    await delay();
    expect(manager.locks).to.be.empty;
  });

  describe('.acquire()', () => {
    it('resolves to an empty array', async () => {
      const locks = await manager.acquire();
      expect(locks).to.be.empty;
    });
  });

  describe('.acquire(key:string)', async () => {
    it('rejects if key is not a string or array of strings or object or array of objects', async () => {
      let error;
      try {
        await manager.acquire(42);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });
  });

  describe('.acquire(key:string, mode)', () => {
    it('rejects if mode is not a number', async () => {
      let error;
      try {
        await manager.acquire('', '');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if mode is unknown', async () => {
      let error;
      try {
        await manager.acquire('', -1);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
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

    it('captures CR lock on parent key when acquired lock mode is CR', async () => {
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
      let error;
      try {
        await manager.acquire('key', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if acquired lock conflicts on parent level', async () => {
      await manager.acquire('parent', EX);
      let error;
      try {
        await manager.acquire('parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if acquired lock conflicts on ancestor level', async () => {
      await manager.acquire('ancestor', EX);
      let error;
      try {
        await manager.acquire('ancestor/parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
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
      let error;
      try {
        await manager.acquire('key', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if acquired lock conflicts on parent level', async () => {
      await manager.acquire('parent', EX, 'owner1');
      let error;
      try {
        await manager.acquire('parent/child', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if acquired lock conflicts on ancestor level', async () => {
      await manager.acquire('ancestor', EX, 'owner1');
      let error;
      try {
        await manager.acquire('ancestor/parent/child', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects with instance of config.AcquireError containing locks property with array of locks failed to acquire', async () => {
      await manager.acquire('key', EX, 'owner1');
      let error;
      try {
        await manager.acquire('key', EX, 'owner2');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).and.property('locks').deep.include.members([
        { key: 'key', mode: EX, owner: 'owner2' }
      ]);
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
        await manager.acquire(['key1', 'key2'], EX, 'owner2');
      } catch (e) {
        // continue
      }
      expect(manager.locks).to.have.length(2);
    });
  });

  describe('.acquire(lock:object)', () => {
    it('rejects if lock.key is not string', async () => {
      let error;
      try {
        await manager.acquire({ key: 42 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if lock.mode is not known mode', async () => {
      let error;
      try {
        await manager.acquire({ key: 'key', mode: 3 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
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
      let error;
      try {
        await manager.acquire([{ key: 42 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
    });

    it('rejects if locks[].mode is not known mode', async () => {
      let error;
      try {
        await manager.acquire([{ key: 'key', mode: 3 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.ok;
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

  describe('.release()', () => {
    it('releases all keys', async () => {
      await manager.acquire(['a', 'b']);
      await manager.release();
      expect(manager.locks).to.be.empty;
    });

    it('resolves to an empty array if there is nothing to release', async () => {
      const locks = await manager.release();
      expect(locks).to.be.empty;
    });
  });

  describe('.release(key:string)', () => {
    it('does not release lock twice if it is already pending for callback', async () => {
      const key = 'key';
      await manager.acquire(key);
      const promise = manager.release(key);
      expect(manager.release(key)).to.be.empty;
      expect(await promise).to.not.be.empty;
    });
  });

  describe('.release(keys:string[])', () => {
    it('releases specified keys', async () => {
      await manager.acquire(['a', 'b', 'c']);
      await manager.release(['a', 'b']);
      expect(manager.keys)
        .to.contain('c')
        .and.not.contain.members(['a', 'b']);
    });
  });

  describe('.select', () => {
    it('is a function', () =>
      expect(manager.select).to.be.a('function')
    );
  });

  describe('.select()', () => {
    it('returns empty set if nothing is locked', () =>
      expect(manager.select())
        .to.be.instanceof(Set)
        .and.have.property('size').which.equal(0)
    );

    it('returns set containing locks hierarchy', async () => {
      await manager.acquire('ancestor/parent/child', EX, 'owner');
      expect(Array.from(manager.select()))
        .to.deep.include.members([
          { key: 'ancestor', mode: CW, owner: 'owner' },
          { key: 'ancestor/parent', mode: CW, owner: 'owner' },
          { key: 'ancestor/parent/child', mode: EX, owner: 'owner' }
        ]);
    });
  });

  describe('.select(key)', () => {
    it('throws if key is not string or array of strings', () =>
      expect(() => manager.select(42))
        .to.throw
    );
  });

  describe('.select(key:string)', () => {
    it('returns empty set if specified key was not locked', async () => {
      await manager.acquire('a');
      expect(manager.select('b'))
        .to.be.instanceof(Set)
        .and.have.property('size')
        .which.equal(0);
    });
  });

  describe('.select(key:string[])', () => {
    it('returns set containing locks for specified keys only', async () => {
      await manager.acquire(['a', 'b', 'c']);
      expect(Array.from(manager.select(['a', 'b'])).map(({ key }) => key))
        .to.include('a')
        .and.include('b');
    });
  });

  describe('.select(predicate:function)', () => {
    it('returns set containing only locks satisfying predicate', async () => {
      await manager.acquire(['a', 'b']);
      expect(Array.from(manager.select(({ key }) => key === 'a')).map(({ key }) => key))
        .to.include('a')
        .and.not.include('b');
    });
  });

  describe('.select(key:string, predicate)', () => {
    it('throws if predicate is not a function', () =>
      expect(() => manager.select('', 42))
        .to.throw
    );
  });

  describe('.select(key:string, predicate:function)', () => {
    it('returns set containing only locks satisfying predicate', async () => {
      await manager.acquire('a', NL, 'owner1');
      await manager.acquire('a', CR, 'owner2');
      expect(Array.from(manager.select('a', ({ mode }) => mode === CR)).map(({ owner }) => owner))
        .to.not.include('owner1');
    });
  });
});
