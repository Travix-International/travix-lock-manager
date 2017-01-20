<a name="LockManager"></a>

## LockManager
**Kind**: global class  
**See**: (@link https://en.wikipedia.org/wiki/Distributed_lock_manager) for the theory.  
**Properties**

- CR <code>Number</code> - Concurrent Read lock mode bit flag.  
- CW <code>Number</code> - Concurrent Write lock mode bit flag.  
- EX <code>Number</code> - Exclusive lock mode bit flag.  
- NL <code>Number</code> - Null lock mode bit flag.  
- PR <code>Number</code> - Protected Read lock mode bit flag.  
- PW <code>Number</code> - Protected Write lock mode bit flag.  


* [LockManager](#LockManager)
    * [new LockManager([config])](#new_LockManager_new)
    * [.acquire(key, [mode], [owner])](#LockManager+acquire) ⇒ <code>Promise</code>
    * [.describe(mode, [short])](#LockManager+describe) ⇒ <code>String</code>
    * [.export([key])](#LockManager+export) ⇒ <code>Set</code>
    * [.keys](#LockManager+keys) ⇒ <code>Array</code>
    * [.locks](#LockManager+locks) ⇒ <code>Array</code>
    * [.release(key, [mode], [owner])](#LockManager+release) ⇒ <code>Promise</code>

<a name="new_LockManager_new"></a>

### new LockManager([config])
Creates new instance of the LockManager class helping to serialise the access to a set of hierarchically organized resources with various levels of exclusivity. All locks are initially kept in memory but can be replicated via `acquired` and `releasing` event handlers (both synchronous or asynchronous).

**Params**

- [config] <code>Object</code> <code> = {}</code> - A configuration object.
    - [.acquired] <code>function</code> <code> = noop</code> - The `acquired` event handler. A function called each time when new locks are acquired or existing locks are prolonged with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being acquired will be removed.
    - [.comparer] <code>String</code> <code> = (a, b) =&gt; a === b</code> - Comparison function used to determine eqality of any two owners. Should return truthy value if owners are equal; falsy value otherwise.
    - [.delimiter] <code>String</code> <code> = &#x27;/&#x27;</code> - String delimiter used to split hierarchical keys.
    - [.Error] <code>String</code> <code> = Error</code> - Error class to construct "Some of requested locks cannot be acquired" error object.
    - [.releasing] <code>function</code> <code> = noop</code> - The `released` event handler. A function called each time when existing locks are released with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being released will be kept.
    - [.timeout] <code>Number</code> <code> = 0</code> - Expiration period of a lock, in milliseconds.

<a name="LockManager+acquire"></a>

### lockManager.acquire(key, [mode], [owner]) ⇒ <code>Promise</code>
Asynchronously acquires or prolongs single or multiple locks. When multiple locks are being acquired, this operation acts via "all or nothing" principle. If at least one lock is failed to acquire, no locks will be acquired.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Promise</code> - A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `acquired` event handler or error stating that not all the requested locks could be acquired.  
**Params**

- key <code>Array</code> | <code>String</code> | <code>Object</code> - String key or lock object or array of string keys or array of lock objects to be acquired. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties.
- [mode] <code>Array</code> | <code>Number</code> <code> = EX</code> - Single lock mode or bitwise combination ( PW | CR) of lock modes to acquire. Multiple modes are attempted in order from most restrictive to less restrictive. Use the correponsing constants exported by this module.
- [owner] <code>String</code> - Lock owner. Arbitrary value denoting a lock owner.

<a name="LockManager+describe"></a>

### lockManager.describe(mode, [short]) ⇒ <code>String</code>
Returns human readable string describing specified lock mode.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>String</code> - Human readable description of the mode.  
**Params**

- mode <code>Number</code> | <code>String</code> - Lock mode to describe.
- [short] <code>boolean</code> <code> = false</code> - Type of description to return: short (2 letters) or long.

<a name="LockManager+export"></a>

### lockManager.export([key]) ⇒ <code>Set</code>
Exports all existing locks or all the locks corresponding to specified keys.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Set</code> - Set of selected locks.  
**Params**

- [key] <code>String</code> <code> = </code> - Key or array of keys to limit selection with. If omitted, all existing locks will be exported.

<a name="LockManager+keys"></a>

### lockManager.keys ⇒ <code>Array</code>
Returns array of acquired keys.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager+locks"></a>

### lockManager.locks ⇒ <code>Array</code>
Returns array of acquired locks.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager+release"></a>

### lockManager.release(key, [mode], [owner]) ⇒ <code>Promise</code>
Asynchronously releases single or multiple locks. When multiple locks are being released, this operation acts via "at least anything" principle. If one lock is failed to release, other locks will still be released.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Promise</code> - A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `relesing` event handler.  
**Params**

- key <code>Array</code> | <code>String</code> | <code>Object</code> | <code>Null</code> - String key or lock object or array of string keys or array of lock objects to be release. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties. If null was passed, all the locks with the specified mode and belonging to the specified owner will be released.
- [mode] <code>Number</code> <code> = EX</code> - Single lock mode or bitwise combination ( PW | CR) of lock modes to release. Use the correponsing constants exported by this module.
- [owner] <code>Any</code> - Lock owner. Arbitrary value denoting a lock owner.

