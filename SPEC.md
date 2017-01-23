# TOC
   - [LockManager](#lockmanager)
   - [new LockManager](#new-lockmanager)
   - [new LockManager(config)](#new-lockmanagerconfig)
   - [new LockManager(config:object)](#new-lockmanagerconfigobject)
     - [.acquire()](#new-lockmanagerconfigobject-acquire)
     - [.acquire(key)](#new-lockmanagerconfigobject-acquirekey)
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
     - [.release(key)](#new-lockmanagerconfigobject-releasekey)
     - [.release(key:string, mode)](#new-lockmanagerconfigobject-releasekeystring-mode)
     - [Lock](#new-lockmanagerconfigobject-lock)
       - [.code](#new-lockmanagerconfigobject-lock-code)
       - [.type](#new-lockmanagerconfigobject-lock-type)
       - [.toString()](#new-lockmanagerconfigobject-lock-tostring)
<a name=""></a>
 
<a name="lockmanager"></a>
# LockManager
is a function.

```js
expect(LockManager).to.be.a('function')
```

<a name="new-lockmanager"></a>
# new LockManager
returns instance of LockManager.

```js
expect(new LockManager()).to.be.instanceOf(LockManager)
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
returns instance of LockManager.

```js
expect(new LockManager({})).to.be.instanceOf(LockManager)
```

throws if config.acquired is not a function.

```js
const operation = () => new LockManager({ acquired: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.acquired with array containing acquired lock.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

does not call config.acquired when lock was not acquired.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

calls config.acquired with array containing existing lock when it is reacquired.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects with error thrown by config.acquired when acquiring lock.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

cancels acquire operation if config.acquired throws.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

throws if config.comparer is not a function.

```js
const operation = () => new LockManager({ comparer: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.comparer to compare owners.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

if config.comparer is not passed uses equality to compare owners.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

throws if config.delimiter is not a string.

```js
const operation = () => new LockManager({ delimiter: null });
expect(operation).to.throw(TypeError);
```

throws if config.Error is not a function.

```js
const operation = () => new LockManager({ Error: null });
expect(operation).to.throw(TypeError);
```

rejects with instance of config.Error when fails to acquire lock.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

throws if config.releasing is not a function.

```js
const operation = () => new LockManager({ releasing: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.releasing when expired lock is being released.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

does not call config.releasing when lock was not released.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects with error thrown by config.releasing when releasing lock.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

cancels release operation if config.releasing throws.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
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

removes acquired lock after timeout.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquire"></a>
## .acquire()
rejects if called without arguments.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekey"></a>
## .acquire(key)
rejects if key is not a string or array of strings or object or array of objects.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

removes leading and trailing config.delimiter from the key.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekeystring-mode"></a>
## .acquire(key:string, mode)
rejects if mode is omitted.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if mode is not a number.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if mode is not positive number.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber"></a>
## .acquire(key:string, mode:number)
resolves with array containing new lock for specified key and mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing existing lock when invoked twice with the same arguments.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new most restrictive available lock for specified key and mode combined from two flags.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures CR lock on parent key when acuired lock mode is CR.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures CR lock on parent key when acuired lock mode is PR.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures CW lock on parent key when acuired lock mode is CW.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures CW lock on parent key when acuired lock mode is EX.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures CW lock on parent key when acuired lock mode is PW.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

captures NL lock on parent key when acuired lock mode is NL.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

prolongs lifespan of reacquired lock.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on same level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on parent level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on ancestor level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber-owner"></a>
## .acquire(key:string, mode:number, owner)
resolves with array containing new lock for specified key, mode and owner.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new most restrictive lock for specified key and mode combined from two flags.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on same level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on parent level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if acquired lock conflicts on ancestor level.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber"></a>
## .acquire(keys:string[], mode:number)
resolves with array containing two new locks for specified keys and mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber-owner"></a>
## .acquire(keys:string[], mode:number, owner)
cancels operation if at least one lock being acquired conflicts with existing.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirelockobject"></a>
## .acquire(lock:object)
rejects if lock.key is not string.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if lock.mode is not known mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new lock for specified lock.key, lock.mode and lock.owner.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirelocksobject"></a>
## .acquire(locks:object[])
rejects if locks[].key is not string.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

rejects if locks[].mode is not known mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new locks for specified locks[].key, locks[].mode and locks[].owner.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirelockobject-modenumber"></a>
## .acquire(lock:object, mode:number)
resolves with array containing new lock for specified mode if lock.mode is not defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new lock for specified lock.mode if it is defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber"></a>
## .acquire(locks:object[], mode:number)
resolves with array containing new locks for specified mode if locks[].mode is not defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new locks for specified locks[].mode if it is defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber-owner"></a>
## .acquire(locks:object[], mode:number, owner)
resolves with array containing new locks for specified owner if locks[].owner is not defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

resolves with array containing new locks for specified locks[].owner if it is defined.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-describe"></a>
## .describe()
returns undefined.

```js
expect(manager.describe()).to.be.undefined
```

<a name="new-lockmanagerconfigobject-describemode"></a>
## .describe(mode)
returns long description for known modes.

```js
MODES.forEach(mode => expect(manager.describe(mode)).to.be.a('string').and.have.length.above(2))
```

returns short description for known modes.

```js
MODES.forEach(mode => expect(manager.describe(mode, true)).to.be.a('string').and.have.length(2))
```

returns undefined for unknown mode.

```js
expect(manager.describe(-1)).to.be.undefined
```

<a name="new-lockmanagerconfigobject-keys"></a>
## .keys
is empty array initially.

```js
expect(manager.keys).to.be.an('array').and.be.empty
```

contains hierarchy of acquired keys.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

does not contain hierarchy of released keys.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-locks"></a>
## .locks
is empty array initially.

```js
expect(manager.locks).to.be.an('array').and.be.empty
```

<a name="new-lockmanagerconfigobject-release"></a>
## .release()
throws if called without arguments.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-releasekey"></a>
## .release(key)
throws if key is not a string or array of strings or object or array of objects.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-releasekeystring-mode"></a>
## .release(key:string, mode)
throws if mode is omitted.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

throws if mode is not a number.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

throws if mode is not positive number.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-lock"></a>
## Lock
<a name="new-lockmanagerconfigobject-lock-code"></a>
### .code
returns short (two-letter) description of the lock mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-lock-type"></a>
### .type
returns long description of the lock mode.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

<a name="new-lockmanagerconfigobject-lock-tostring"></a>
### .toString()
returns string containing lock key and type if owner is not specified.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

returns string containing lock key, type and owner if owner is specified.

```js
var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); });
```

