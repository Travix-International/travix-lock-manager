# TOC
   - [lock](#lock)
     - [.code](#lock-code)
     - [.type](#lock-type)
     - [.toString()](#lock-tostring)
   - [LockManager](#lockmanager)
   - [new LockManager](#new-lockmanager)
   - [new LockManager(config)](#new-lockmanagerconfig)
   - [new LockManager(config:object)](#new-lockmanagerconfigobject)
     - [.acquire()](#new-lockmanagerconfigobject-acquire)
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
     - [.release()](#new-lockmanagerconfigobject-release)
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
returns short (two-letter) description of the lock mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="lock-type"></a>
## .type
returns long description of the lock mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="lock-tostring"></a>
## .toString()
returns string containing lock key and type if owner is not specified.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

returns string containing lock key, type and owner if owner is specified.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

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
expect(new LockManager()).to.be.instanceof(LockManager)
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
expect(new LockManager({})).to.be.instanceof(LockManager)
```

throws if config.AcquireError is not a function.

```js
const operation = () => new LockManager({ AcquireError: 42 });
expect(operation).to.throw(TypeError);
```

rejects with instance of config.AcquireError when fails to acquire lock initialized with failed locks.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

throws if config.comparer is not a function.

```js
const operation = () => new LockManager({ comparer: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.comparer to compare owners.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

if config.comparer is not passed uses equality to compare owners.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

throws if config.delimiter is not a string.

```js
const operation = () => new LockManager({ delimiter: null });
expect(operation).to.throw(TypeError);
```

removes leading and trailing config.delimiter from the key.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

accepts empty delimiter.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

throws if config.onacquire is not a function.

```js
const operation = () => new LockManager({ onacquire: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.onacquire with array containing onacquire lock.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

does not call config.onacquire when lock has not been acquired.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

calls config.onacquire with array containing existing lock when it is reacquired.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects with error thrown by config.onacquire when acquiring lock.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

cancels acquire operation if config.onacquire throws.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

throws if config.onrelease is not a function.

```js
const operation = () => new LockManager({ onrelease: 'test' });
expect(operation).to.throw(TypeError);
```

calls config.onrelease when expired lock is being released.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

does not call config.onrelease when lock has not been released.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects with error thrown by config.onrelease when releasing lock.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

cancels release operation if config.onrelease throws.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

extends expired lock if config.onrelease throws.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
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
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquire"></a>
## .acquire()
rejects if called without arguments.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeystring"></a>
## .acquire(key:string)
rejects if key is not a string or array of strings or object or array of objects.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeystring-mode"></a>
## .acquire(key:string, mode)
rejects if mode is not a number.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if mode is unknown.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber"></a>
## .acquire(key:string, mode:number)
resolves with array containing new lock for specified key and mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing existing lock when invoked twice with the same arguments.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new most restrictive available lock for specified key and mode combined from two flags.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures CR lock on parent key when acquired lock mode is CR.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures CR lock on parent key when acuired lock mode is PR.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures CW lock on parent key when acuired lock mode is CW.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures CW lock on parent key when acuired lock mode is EX.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures CW lock on parent key when acuired lock mode is PW.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

captures NL lock on parent key when acuired lock mode is NL.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

prolongs lifespan of reacquired lock.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on same level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on parent level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on ancestor level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeystring-modenumber-owner"></a>
## .acquire(key:string, mode:number, owner)
resolves with array containing new lock for specified key, mode and owner.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new most restrictive lock for specified key and mode combined from two flags.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on same level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on parent level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if acquired lock conflicts on ancestor level.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber"></a>
## .acquire(keys:string[], mode:number)
resolves with array containing two new locks for specified keys and mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirekeysstring-modenumber-owner"></a>
## .acquire(keys:string[], mode:number, owner)
cancels operation if at least one lock being acquired conflicts with existing.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirelockobject"></a>
## .acquire(lock:object)
rejects if lock.key is not string.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if lock.mode is not known mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new lock for specified lock.key, lock.mode and lock.owner.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirelocksobject"></a>
## .acquire(locks:object[])
rejects if locks[].key is not string.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

rejects if locks[].mode is not known mode.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new locks for specified locks[].key, locks[].mode and locks[].owner.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirelockobject-modenumber"></a>
## .acquire(lock:object, mode:number)
resolves with array containing new lock for specified mode if lock.mode is not defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new lock for specified lock.mode if it is defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber"></a>
## .acquire(locks:object[], mode:number)
resolves with array containing new locks for specified mode if locks[].mode is not defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new locks for specified locks[].mode if it is defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-acquirelocksobject-modenumber-owner"></a>
## .acquire(locks:object[], mode:number, owner)
resolves with array containing new locks for specified owner if locks[].owner is not defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

resolves with array containing new locks for specified locks[].owner if it is defined.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
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
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

does not contain hierarchy of released keys.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-release"></a>
## .release()
releases all keys.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

does not release lock twice if it is already pending for callback.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-select"></a>
## .select
is a function.

```js
expect(manager.select).to.be.a('function')
```

<a name="new-lockmanagerconfigobject-select"></a>
## .select()
returns empty set if nothing is locked.

```js
expect(manager.select()).to.be.instanceof(Set).and.have.property('size').which.equal(0)
```

returns set containing locks hierarchy.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-selectkey"></a>
## .select(key)
throws if key is not string or array of strings.

```js
expect(() => manager.select(42)).to.throw
```

<a name="new-lockmanagerconfigobject-selectkeystring"></a>
## .select(key:string)
returns empty set if specified key was not locked.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-selectkeystring"></a>
## .select(key:string[])
returns set containing locks for specified keys only.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-selectpredicatefunction"></a>
## .select(predicate:function)
returns set containing only locks satisfying predicate.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

<a name="new-lockmanagerconfigobject-selectkeystring-predicate"></a>
## .select(key:string, predicate)
throws if predicate is not a function.

```js
expect(() => manager.select('', 42)).to.throw
```

<a name="new-lockmanagerconfigobject-selectkeystring-predicatefunction"></a>
## .select(key:string, predicate:function)
returns set containing only locks satisfying predicate.

```js
var gen = fn.apply(this, arguments);
return new _promise2.default(function (resolve, reject) {
  function step(key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      return _promise2.default.resolve(value).then(function (value) {
        step("next", value);
      }, function (err) {
        step("throw", err);
      });
    }
  }
  return step("next");
});
```

