# TOC
   - [lock](#lock)
     - [.code](#lock-code)
     - [.parent](#lock-parent)
     - [.type](#lock-type)
     - [.toString()](#lock-tostring)
   - [LockManager](#lockmanager)
   - [new LockManager](#new-lockmanager)
   - [new LockManager(config)](#new-lockmanagerconfig)
   - [new LockManager(config:object)](#new-lockmanagerconfigobject)
     - [.acquire()](#new-lockmanagerconfigobject-acquire)
     - [.acquire(key)](#new-lockmanagerconfigobject-acquirekey)
     - [.acquire(key:string)](#new-lockmanagerconfigobject-acquirekeystring)
     - [.acquire(key:string, mode)](#new-lockmanagerconfigobject-acquirekeystring-mode)
     - [.acquire(key:string, mode:number)](#new-lockmanagerconfigobject-acquirekeystring-modenumber)
     - [.acquire(key:string, mode:number, owner)](#new-lockmanagerconfigobject-acquirekeystring-modenumber-owner)
     - [.acquire(keys:string[], mode:number)](#new-lockmanagerconfigobject-acquirekeysstring-modenumber)
     - [.acquire(keys:string[], mode:number, owner)](#new-lockmanagerconfigobject-acquirekeysstring-modenumber-owner)
     - [.acquire(lock:object)](#new-lockmanagerconfigobject-acquirelockobject)
     - [.acquire(locks:object[])](#new-lockmanagerconfigobject-acquirelocksobject)
     - [.acquire(lock:object, mode:number)](#new-lockmanagerconfigobject-acquirelockobject-modenumber)
     - [.acquire(locks:object[], mode:number)](#new-lockmanagerconfigobject-acquirelocksobject-modenumber)
     - [.acquire(locks:object[], mode:number, owner)](#new-lockmanagerconfigobject-acquirelocksobject-modenumber-owner)
     - [.describe()](#new-lockmanagerconfigobject-describe)
     - [.describe(mode)](#new-lockmanagerconfigobject-describemode)
     - [.keys](#new-lockmanagerconfigobject-keys)
     - [.locks](#new-lockmanagerconfigobject-locks)
     - [.release()](#new-lockmanagerconfigobject-release)
     - [.release(key:string)](#new-lockmanagerconfigobject-releasekeystring)
     - [.release(keys:string[])](#new-lockmanagerconfigobject-releasekeysstring)
     - [.select](#new-lockmanagerconfigobject-select)
     - [.select()](#new-lockmanagerconfigobject-select)
     - [.select(key)](#new-lockmanagerconfigobject-selectkey)
     - [.select(key:string)](#new-lockmanagerconfigobject-selectkeystring)
     - [.select(key:string[])](#new-lockmanagerconfigobject-selectkeystring)
     - [.select(predicate:function)](#new-lockmanagerconfigobject-selectpredicatefunction)
     - [.select(key:string, predicate)](#new-lockmanagerconfigobject-selectkeystring-predicate)
     - [.select(key:string, predicate:function)](#new-lockmanagerconfigobject-selectkeystring-predicatefunction)
<a name=""></a>
 
<a name="lock"></a>
# lock
<a name="lock-code"></a>
## .code
gets short (two-letter) description of the lock mode.

```js
async () => {
      const { CODES, MODES } = LockManager;
      const manager = new LockManager;
      for (let i = MODES.length; --i >= 0;) {
        const code = CODES[i];
        const mode = MODES[i];
        const [lock] = await manager.acquire(code, mode);
        expect(lock.code).to.be.a('string').which.equals(code);
      }
    }
```

<a name="lock-parent"></a>
## .parent
gets undefined if lock is acquired on top-level key.

```js
async () => {
      const manager = new LockManager;
      const [lock] = await manager.acquire('');
      expect(lock.parent).to.be.undefined;
    }
```

gets parent lock object if lock is acquired on non-top-level key.

```js
async () => {
      const manager = new LockManager;
      const [lock] = await manager.acquire('parent/child');
      expect(lock.parent).to.be.an('object').with.property('key').which.equals('parent');
    }
```

<a name="lock-type"></a>
## .type
gets long description of the lock mode.

```js
async () => {
      const { MODES, TYPES } = LockManager;
      const manager = new LockManager;
      for (let i = MODES.length; --i >= 0;) {
        const mode = MODES[i];
        const type = TYPES[i];
        const [lock] = await manager.acquire(type, mode);
        expect(lock.type).to.be.a('string').which.equals(type);
      }
    }
```

<a name="lock-tostring"></a>
## .toString()
returns string containing lock key and type if owner is not specified.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const key = 'key', mode = EX, type = manager.describe(mode);
      const [lock] = await manager.acquire(key, mode);
      expect(lock.toString()).to.be.a('string').and.contain(key).and.contain(type);
    }
```

returns string containing lock key, owner and type if owner is specified.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const key = 'key', mode = EX, owner = 'owner', type = manager.describe(mode);
      const [lock] = await manager.acquire(key, mode, owner);
      expect(lock.toString()).to.be.a('string').and.contain(key).and.contain(owner).and.contain(type);
    }
```

<a name="lockmanager"></a>
# LockManager
is a function.

```js
expect(LockManager).to.be.a('function')
```

<a name="new-lockmanager"></a>
# new LockManager
creates new instance of LockManager.

```js
expect(new LockManager).to.be.instanceof(LockManager)
```

<a name="new-lockmanagerconfig"></a>
# new LockManager(config)
throws if config is not an object.

```js
const operation = () => new LockManager(null);
expect(operation).to.throw(TypeError);
```

<a name="new-lockmanagerconfigobject"></a>
# new LockManager(config:object)
creates new instance of LockManager.

```js
expect(new LockManager({})).to.be.instanceof(LockManager)
```

throws if config.AcquireError is not a function.

```js
const operation = () => new LockManager({ AcquireError: 42 });
expect(operation).to.throw(TypeError);
```

throws if config.comparer is not a function.

```js
const operation = () => new LockManager({ comparer: 'test' });
expect(operation).to.throw(TypeError);
```

throws if config.delimiter is not a string.

```js
const operation = () => new LockManager({ delimiter: null });
expect(operation).to.throw(TypeError);
```

throws if config.onacquire is not a function.

```js
const operation = () => new LockManager({ onacquire: 'test' });
expect(operation).to.throw(TypeError);
```

throws if config.onrelease is not a function.

```js
const operation = () => new LockManager({ onrelease: 'test' });
expect(operation).to.throw(TypeError);
```

throws if config.timeout is not a number.

```js
const operation = () => new LockManager({ timeout: null });
expect(operation).to.throw(TypeError);
```

throws if config.timeout is a negative number.

```js
const operation = () => new LockManager({ timeout: -1 });
expect(operation).to.throw(TypeError);
```

<a name="new-lockmanagerconfigobject-acquire"></a>
## .acquire()
resolves to an empty array.

```js
async () => {
      const manager = new LockManager;
      const locks = await manager.acquire();
      expect(locks).to.be.empty;
    }
```

<a name="new-lockmanagerconfigobject-acquirekey"></a>
## .acquire(key)
eventually throws TypeError if key is not a string or array of strings or object or array of objects.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire(42);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

<a name="new-lockmanagerconfigobject-acquirekeystring"></a>
## .acquire(key:string)
works empty delimiter.

```js
async () => {
      const manager = new LockManager({ delimiter: '' });
      const key = 'solid / key';
      const [lock] = await manager.acquire(key);
      expect(lock).to.have.property('key', key);
    }
```

removes leading and trailing delimiter from the key.

```js
async () => {
      const delimiter = '|';
      const manager = new LockManager({ delimiter });
      const [lock] = await manager.acquire(delimiter + 'key' + delimiter + delimiter);
      expect(lock).to.have.property('key', 'key');
    }
```

automatically releases lock on timeout.

```js
async () => {
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
    }
```

calls onrelease handler when expired lock is released on timeout.

```js
async () => {
      const onrelease = spy();
      const timeout = 10;
      const manager = new LockManager({ onrelease, timeout });
      const [lock] = await manager.acquire('key');
      await delay(timeout);
      expect(onrelease).to.have.been.calledOnce.and.calledWithMatch([lock]);
    }
```

prolongs lifespan of re-acquired lock.

```js
async () => {
      const timeout = 10;
      const manager = new LockManager({ timeout });
      const [lock] = await manager.acquire('key');
      await delay(timeout / 2);
      await manager.acquire('key');
      await delay(timeout / 2);
      expect(manager.locks).to.contain(lock);
    }
```

calls onacquire handler once passing array containing acquired lock.

```js
async () => {
      const onacquire = spy();
      const manager = new LockManager({ onacquire });
      const locks = await manager.acquire('key');
      expect(onacquire).to.have.been.calledOnce.and.calledWith(locks);
    }
```

calls onacquire handler with array containing existing lock if it has been re-acquired.

```js
async () => {
      const onacquire = spy();
      const manager = new LockManager({ onacquire });
      await manager.acquire('key');
      const locks = await manager.acquire('key');
      expect(onacquire).to.have.been.calledTwice.and.calledWithExactly(locks);
    }
```

eventually throws error thrown by onacquire handler.

```js
async () => {
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
    }
```

cancels acquire operation, if onacquire handler throws an error.

```js
async () => {
      const onacquire = stub().throws();
      const manager = new LockManager({ onacquire });
      try {
        await manager.acquire('key');
      } catch (e) {
        // continue
      }
      expect(manager.locks).to.be.empty;
    }
```

extends expired lock if onrelease handler throws.

```js
async () => {
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
    }
```

<a name="new-lockmanagerconfigobject-acquirekeystring-mode"></a>
## .acquire(key:string, mode)
eventually throws TypeError if mode is not a number.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire('', '');
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

eventually throws TypeError if mode is unknown.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire('', -1);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber"></a>
## .acquire(key:string, mode:number)
eventually returns array containing new lock for specified key and mode.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', EX);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: EX, owner: undefined }
      ]);
    }
```

eventually returns array containing existing lock if it has not expired.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const [first] = await manager.acquire('key', EX);
      const [second] = await manager.acquire('key', EX);
      expect(first).to.equal(second);
    }
```

eventually returns array containing new most restrictive available lock for specified key and combination of modes.

```js
async () => {
      const { CR, CW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', CR | CW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: CW, owner: undefined }
      ]);
    }
```

eventually captures CR lock on the parent key when requested lock mode is CR.

```js
async () => {
      const { CR } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', CR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    }
```

eventually captures CR lock on the parent key when requested lock mode is PR.

```js
async () => {
      const { CR, PR } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', PR);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CR, owner: undefined }
      ]);
    }
```

eventually captures CW lock on the parent key when acuired lock mode is CW.

```js
async () => {
      const { CW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', CW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    }
```

eventually captures CW lock on the parent key when acuired lock mode is EX.

```js
async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', EX);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    }
```

eventually captures CW lock on parent key when acuired lock mode is PW.

```js
async () => {
      const { CW, PW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', PW);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: CW, owner: undefined }
      ]);
    }
```

eventually captures NL lock on parent key when acuired lock mode is NL.

```js
async () => {
      const { NL } = LockManager;
      const manager = new LockManager;
      await manager.acquire('parent/child', NL);
      expect(manager.locks).to.deep.include.members([
        { key: 'parent', mode: NL, owner: undefined }
      ]);
    }
```

does not call onacquire handler if lock has not been acquired.

```js
async () => {
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
    }
```

eventually throws AcquireError initialized with array of locks conflicting on the same level.

```js
async () => {
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
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([{
        key: 'parent/child', mode: PW, owner: undefined
      }]);
    }
```

eventually throws AcquireError initialized with array of locks conflicting on the parent level.

```js
async () => {
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('parent', EX);
      let error;
      try {
        await manager.acquire('parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([{
        key: 'parent/child', mode: PW, owner: undefined
      }]);
    }
```

eventually throws AcquireError initialized with array of locks conflicting on the ancestor level.

```js
async () => {
      const { EX, PW } = LockManager;
      const manager = new LockManager({ AcquireError });
      await manager.acquire('ancestor', EX);
      let error;
      try {
        await manager.acquire('ancestor/parent/child', PW);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(AcquireError).with.property('locks').that.deep.equals([{
        key: 'ancestor/parent/child', mode: PW, owner: undefined
      }]);
    }
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber-owner"></a>
## .acquire(key:string, mode:number, owner)
uses configured comparer to compare owners.

```js
async () => {
      const { NL } = LockManager;
      const comparer = spy((owner1, owner2) => owner1 === owner2);
      const manager = new LockManager({ comparer });
      await manager.acquire('key', NL, 'owner1');
      await manager.acquire('key', NL, 'owner2');
      expect(comparer).to.be.calledWith('owner1', 'owner2');
    }
```

uses strict equality to compare owners if comparer is not configured.

```js
async () => {
      const { NL } = LockManager;
      const manager = new LockManager;
      const [lock1] = await manager.acquire('key', NL, 'owner');
      const [lock2] = await manager.acquire('key', NL, 'owner');
      expect(lock1).to.equal(lock2);
    }
```

eventually returns array containing new lock for specified key, mode and owner.

```js
async () => {
      const { PR } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire('key', PR, 'owner');
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PR, owner: 'owner' }
      ]);
    }
```

eventually returns array containing new most restrictive lock for specified key, combination of modes and owner.

```js
async () => {
      const { CR, PW } = LockManager;
      const manager = new LockManager;
      await manager.acquire('key', PW, 'owner1');
      const locks = await manager.acquire('key', CR | PW, 'owner2');
      expect(locks).to.be.an('array').that.deep.equals([
        { key: 'key', mode: CR, owner: 'owner2' }
      ]);
    }
```

eventually throws AcquireError initalized with array of locks conflicting on the same level.

```js
async () => {
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
        { key: 'key', mode: EX, owner: 'owner2' }
      ]);
    }
```

eventually throws AcquireError initalized with array of locks conflicting on the parent level.

```js
async () => {
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
        { key: 'parent/child', mode: EX, owner: 'owner2' }
      ]);
    }
```

eventually throws AcquireError initalized with array of locks conflicting on the ancestor level.

```js
async () => {
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
        { key: 'ancestor/parent/child', mode: EX, owner: 'owner2' }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber"></a>
## .acquire(keys:string[], mode:number)
eventually returns array containing two new locks for specified keys and mode.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire(['key1', 'key2'], EX);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key1', mode: EX, owner: undefined },
        { key: 'key2', mode: EX, owner: undefined }
      ]);
    }
```

eventually throws AcquireError initalized with array of locks conflicting on the same level.

```js
async () => {
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
        { key: 'key1', mode: EX, owner: 'owner2' },
        { key: 'key1', mode: PW, owner: 'owner2' }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber-owner"></a>
## .acquire(keys:string[], mode:number, owner)
cancels operation if one of requested locks conflicts with existing one.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('key1', EX, 'owner1');
      try {
        await manager.acquire(['key1', 'key2'], EX, 'owner2');
      } catch (e) {
        // continue
      }
      expect(manager.keys).to.not.include('key2');
    }
```

<a name="new-lockmanagerconfigobject-acquirelockobject"></a>
## .acquire(lock:object)
eventually throws TypeError if lock.key is not a string.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire({ key: 42 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

eventually throws TypeError if lock.mode is not a known mode.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire({ key: 'key', mode: 3 });
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

eventually returns array containing new lock for specified lock.key, lock.mode and lock.owner.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key', mode: EX, owner: 'owner' });
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: EX, owner: 'owner' }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-acquirelocksobject"></a>
## .acquire(locks:object[])
eventually throws TypeError if locks[].key is not string.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire([{ key: 42 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

rejects throws TypeError if locks[].mode is not known mode.

```js
async () => {
      const manager = new LockManager;
      let error;
      try {
        await manager.acquire([{ key: 'key', mode: 3 }]);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceof(TypeError);
    }
```

eventually returns array containing new locks for requested locks[].key, locks[].mode and locks[].owner.

```js
async () => {
      const { CR, CW } = LockManager;
      const manager = new LockManager;
      const requested = [
        { key: 'key1', mode: CR, owner: 'owner1' },
        { key: 'key2', mode: CW, owner: 'owner2' }
      ];
      const locks = await manager.acquire(requested);
      expect(locks).to.be.an('array').and.deep.equal(requested);
    }
```

<a name="new-lockmanagerconfigobject-acquirelockobject-modenumber"></a>
## .acquire(lock:object, mode:number)
eventually returns array containing new lock for the requested mode if lock.mode is not defined.

```js
async () => {
      const { PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key' }, PW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PW, owner: undefined }
      ]);
    }
```

eventually returns array containing new lock for the requested lock.mode if it is defined.

```js
async () => {
      const { NL, PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire({ key: 'key', mode: PW }, NL);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key', mode: PW, owner: undefined }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber"></a>
## .acquire(locks:object[], mode:number)
eventually returns array containing new locks for the requested mode if locks[].mode is not defined.

```js
async () => {
      const { PW } = LockManager;
      const manager = new LockManager;
      const locks = await manager.acquire([{ key: 'key1' }, { key: 'key2' }], PW);
      expect(locks).to.be.an('array').and.deep.equal([
        { key: 'key1', mode: PW, owner: undefined },
        { key: 'key2', mode: PW, owner: undefined }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber-owner"></a>
## .acquire(locks:object[], mode:number, owner)
eventually returns array containing new locks for requested mode and owner if locks[].mode or locks[].owner are not defined.

```js
async () => {
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
    }
```

<a name="new-lockmanagerconfigobject-describe"></a>
## .describe()
returns undefined.

```js
const manager = new LockManager;
expect(manager.describe()).to.be.undefined
```

<a name="new-lockmanagerconfigobject-describemode"></a>
## .describe(mode)
returns long description for known modes.

```js
const { MODES } = LockManager;
const manager = new LockManager;
for (const mode of MODES) {
  expect(manager.describe(mode)).to.be.a('string').and.have.length.above(2)
}
```

returns short description for known modes.

```js
const { MODES } = LockManager;
const manager = new LockManager;
for (const mode of MODES) {
  expect(manager.describe(mode, true)).to.be.a('string').and.have.length(2);
}
```

returns undefined for unknown mode.

```js
const manager = new LockManager;
expect(manager.describe(-1)).to.be.undefined
```

<a name="new-lockmanagerconfigobject-keys"></a>
## .keys
gets empty array if no locks were acquired.

```js
const manager = new LockManager;
expect(manager.keys).to.be.an('array').and.be.empty;
```

gets array that contains hierarchy of acquired keys.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire('ancestor/parent/child');
      expect(manager.keys).to.include.members([
        '', 'ancestor', 'ancestor/parent', 'ancestor/parent/child'
      ]);
    }
```

gets array that does not contain hierarchy of released keys.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire(['ancestor1/parent1/child1', 'ancestor2/parent2/child2']);
      await manager.release('ancestor2/parent2/child2');
      expect(manager.keys).to.not.include.members([
        'ancestor2', 'ancestor2/parent2', 'ancestor2/parent2/child2'
      ]);
    }
```

gets empty array after all locks have been released.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      await manager.acquire(['key2', 'key3']);
      await manager.release();
      expect(manager.keys).to.be.an('array').and.be.empty;
    }
```

<a name="new-lockmanagerconfigobject-locks"></a>
## .locks
gets empty array if no locks have been acquired.

```js
const manager = new LockManager;
expect(manager.locks).to.be.an('array').and.be.empty;
```

gets array that contains hierarchy of acquired keys.

```js
async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire('ancestor/parent/child', EX, 'owner');
      expect(manager.locks).to.be.an('array').and.have.lengthOf(4).and.deep.include.members([
        { key: '', mode: CW, owner: 'owner' },
        { key: 'ancestor', mode: CW, owner: 'owner' },
        { key: 'ancestor/parent', mode: CW, owner: 'owner' },
        { key: 'ancestor/parent/child', mode: EX, owner: 'owner' }
      ]);
    }
```

gets array that does not contain hierarchy of released keys.

```js
async () => {
      const { CW, EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['ancestor1/parent1/child1', 'ancestor2/parent2/child2'], EX, 'owner');
      await manager.release('ancestor2/parent2/child2', EX, 'owner');
      expect(manager.locks).to.be.an('array').and.have.lengthOf(4).and.not.deep.include.members([
        { key: 'ancestor2', mode: CW, owner: 'owner' },
        { key: 'ancestor2/parent2', mode: CW, owner: 'owner' },
        { key: 'ancestor2/parent2/child2', mode: EX, owner: 'owner' }
      ]);
    }
```

gets empty array after all locks were released.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      await manager.acquire(['key2', 'key3']);
      await manager.release();
      expect(manager.locks).to.be.an('array').and.be.empty;
    }
```

<a name="new-lockmanagerconfigobject-release"></a>
## .release()
resolves to an empty array if there is nothing to release.

```js
async () => {
      const manager = new LockManager;
      const locks = await manager.release();
      expect(locks).to.be.empty;
    }
```

does not call config.onrelease if there is nothing to release.

```js
async () => {
      const onrelease = spy();
      const manager = new LockManager({ onrelease });
      await manager.release();
      expect(onrelease).to.not.have.been.called;
    }
```

releases all previously acquired keys.

```js
async () => {
      const manager = new LockManager;
      const acquired = await manager.acquire(['key1', 'key2']);
      const released = await manager.release();
      expect(released).to.deep.equal(acquired);
    }
```

<a name="new-lockmanagerconfigobject-releasekeystring"></a>
## .release(key:string)
does not release lock again if it waits for onrelease handler to complete.

```js
async () => {
      const onrelease = stub().returns(delay(10));
      const manager = new LockManager({ onrelease });
      await manager.acquire('key');
      const released = manager.release('key');
      const retried = manager.release('key');
      expect(await released).to.not.be.empty;
      expect(await retried).to.be.empty;
    }
```

eventually throws error thrown by onrelease handler.

```js
async () => {
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
    }
```

cancels operation if onrelease handler throws.

```js
async () => {
      const onrelease = stub().throws();
      const manager = new LockManager({ onrelease });
      const [lock] = await manager.acquire('key');
      try {
        await manager.release('key');
      } catch (e) {
        // continue
      }
      expect(manager.locks).to.contain(lock);
    }
```

<a name="new-lockmanagerconfigobject-releasekeysstring"></a>
## .release(keys:string[])
releases specified keys.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2', 'key3']);
      await manager.release(['key1', 'key2']);
      expect(manager.keys).to.contain('key3').and.not.contain.members(['key1', 'key2']);
    }
```

<a name="new-lockmanagerconfigobject-select"></a>
## .select
is a function.

```js
const manager = new LockManager;
expect(manager.select).to.be.a('function')
```

<a name="new-lockmanagerconfigobject-select"></a>
## .select()
returns empty set if no locks has been acquired.

```js
const manager = new LockManager;
const set = manager.select();
expect(set).to.be.instanceof(Set).with.property('size', 0);
```

returns set containing hierarchy of acquired locks.

```js
async () => {
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
    }
```

<a name="new-lockmanagerconfigobject-selectkey"></a>
## .select(key)
throws TypeError if key is not string or array of strings.

```js
const manager = new LockManager;
const operation = () => manager.select(42);
expect(operation).to.throw(TypeError);
```

<a name="new-lockmanagerconfigobject-selectkeystring"></a>
## .select(key:string)
returns empty set if specified key was not locked.

```js
async () => {
      const manager = new LockManager;
      await manager.acquire('key1');
      const set = manager.select('key2');
      expect(set).to.be.instanceof(Set).with.property('size', 0);
    }
```

<a name="new-lockmanagerconfigobject-selectkeystring"></a>
## .select(key:string[])
returns set containing locks for specified keys only.

```js
async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      await manager.acquire(['key1', 'key2', 'key3']);
      const set = manager.select(['key1', 'key2']);
      expect(set).to.be.instanceof(Set).with.property('size', 2);
      expect(Array.from(set)).to.deep.equal([
        { key: 'key1', mode: EX, owner: undefined },
        { key: 'key2', mode: EX, owner: undefined }
      ]);
    }
```

<a name="new-lockmanagerconfigobject-selectpredicatefunction"></a>
## .select(predicate:function)
returns set containing only locks satisfying passed predicate.

```js
async () => {
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
    }
```

<a name="new-lockmanagerconfigobject-selectkeystring-predicate"></a>
## .select(key:string, predicate)
throws TypeError if predicate is not a function.

```js
const manager = new LockManager;
const operation = () => manager.select('', 42);
expect(operation).to.throw(TypeError);
```

<a name="new-lockmanagerconfigobject-selectkeystring-predicatefunction"></a>
## .select(key:string, predicate:function)
returns set containing only locks for specified key satisfying passed predicate.

```js
async () => {
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
    }
```

