## Classes

<dl>
<dt><a href="#Lock">Lock</a></dt>
<dd><p>Lock class. Represents a particular lock on a resource.</p>
</dd>
<dt><a href="#LockManager">LockManager</a></dt>
<dd><p>LockManager class. Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity. All locks are initially kept in memory but can be distributed or replicated via <code>onacquire</code> and <code>onrelease</code> event handlers (both synchronous or asynchronous).</p>
</dd>
</dl>

<a name="Lock"></a>

## Lock
Lock class. Represents a particular lock on a resource.

**Kind**: global class  
**Propety**: <code>String</code> key - Key this lock associated with.  
**Propety**: <code>Number</code> mode - Bit flag representing mode (level of exclusivity) of this lock.  
**Propety**: <code>Any</code> owner - Arbitrary value denoting the owner of this lock.  
**Propety**: <code>[Lock](#Lock)</code> parent - Parent lock if any.  
**Propety**: <code>Boolean</code> primary - Logical value indicating whether this lock is the primary lock or is captured on the parent key.  

* [Lock](#Lock)
    * [.code](#Lock+code) ⇒ <code>String</code>
    * [.type](#Lock+type) ⇒ <code>String</code>
    * [.toString()](#Lock+toString) ⇒ <code>String</code>

<a name="Lock+code"></a>

### lock.code ⇒ <code>String</code>
Returns code (short two-letter description) of this lock mode.

**Kind**: instance property of <code>[Lock](#Lock)</code>  
<a name="Lock+type"></a>

### lock.type ⇒ <code>String</code>
Returns type (long description) of this lock mode.

**Kind**: instance property of <code>[Lock](#Lock)</code>  
<a name="Lock+toString"></a>

### lock.toString() ⇒ <code>String</code>
Returns string representation of this lock in format: Lock of "key" [by "owner"] for "type". Owner is included only if it was specified.

**Kind**: instance method of <code>[Lock](#Lock)</code>  
<a name="LockManager"></a>

## LockManager
LockManager class. Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity. All locks are initially kept in memory but can be distributed or replicated via `onacquire` and `onrelease` event handlers (both synchronous or asynchronous).

**Kind**: global class  

* [LockManager](#LockManager)
    * [new LockManager([config])](#new_LockManager_new)
    * _instance_
        * [.keys](#LockManager+keys) ⇒ <code>Array</code>
        * [.locks](#LockManager+locks) ⇒ <code>Array</code>
        * [.acquire(key, [mode], [owner])](#LockManager+acquire) ⇒ <code>Promise</code>
        * [.describe(mode, [short])](#LockManager+describe) ⇒ <code>String</code>
        * [.release(key, [mode], [owner])](#LockManager+release) ⇒ <code>Promise</code>
        * [.select([key], [predicate])](#LockManager+select) ⇒ <code>Set</code>
    * _static_
        * [.CR](#LockManager.CR) ⇒ <code>Number</code>
        * [.CW](#LockManager.CW) ⇒ <code>Number</code>
        * [.EX](#LockManager.EX) ⇒ <code>Number</code>
        * [.NL](#LockManager.NL) ⇒ <code>Number</code>
        * [.PR](#LockManager.PR) ⇒ <code>Number</code>
        * [.PW](#LockManager.PW) ⇒ <code>Number</code>
        * [.CODES](#LockManager.CODES) ⇒ <code>Array</code>
        * [.MODES](#LockManager.MODES) ⇒ <code>Array</code>
        * [.TYPES](#LockManager.TYPES) ⇒ <code>Array</code>

<a name="new_LockManager_new"></a>

### new LockManager([config])
Creates new instance of the LockManager class.

**Params**

- [config] <code>Object</code> <code> = {}</code> - A configuration object.
    - [.comparer] <code>String</code> <code> = (a, b) =&gt; a === b</code> - Comparison function used to determine eqality of any two owners. Should return truthy value if owners are equal; falsy value otherwise.
    - [.delimiter] <code>String</code> <code> = &#x27;/&#x27;</code> - String delimiter used to split hierarchical keys.
    - [.AcquisitionError] <code>String</code> <code> = Error</code> - Error class to use when throwing error that some of requested locks cannot be acquired.
    - [.onacquire] <code>function</code> - The `acquired` event handler. A function called each time when new locks are acquired or existing locks are prolonged with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being acquired will be removed (rollback semantics).
    - [.onrelease] <code>function</code> - The `releasing` event handler. A function called each time when existing locks are released with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being released will be kept (rollback semantics).
    - [.timeout] <code>Number</code> <code> = 0</code> - Expiration period of a lock, in milliseconds.

<a name="LockManager+keys"></a>

### lockManager.keys ⇒ <code>Array</code>
Returns array of unique keys of locks that are currently held.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager+locks"></a>

### lockManager.locks ⇒ <code>Array</code>
Returns array of all locks that are currently held.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
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

<a name="LockManager+release"></a>

### lockManager.release(key, [mode], [owner]) ⇒ <code>Promise</code>
Asynchronously releases single or multiple locks. When multiple locks are being released, this operation acts via "at least anything" principle. If one lock is failed to release, other locks will still be released.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Promise</code> - A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `releasing` event handler.  
**Params**

- key <code>Array</code> | <code>String</code> | <code>Object</code> | <code>Null</code> - String key or lock object or array of string keys or array of lock objects to be release. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties. If null was passed, all the locks with the specified mode and belonging to the specified owner will be released.
- [mode] <code>Number</code> <code> = EX</code> - Single lock mode or bitwise combination ( PW | CR) of lock modes to release. Use the correponsing constants exported by this module.
- [owner] <code>Any</code> - Lock owner. Arbitrary value denoting a lock owner.

<a name="LockManager+select"></a>

### lockManager.select([key], [predicate]) ⇒ <code>Set</code>
Selects and returns locks corresponding to specified keys and passing predicate check.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Set</code> - Set of selected locks.  
**Params**

- [key] <code>Array</code> | <code>String</code> <code> = </code> - Key or array of keys to limit selection with. If omitted, all existing keys will be considered.
- [predicate] <code>function</code> <code> = </code> - Function accepting lock argument and returning truthy value if this lock is to be selected.

<a name="LockManager.CR"></a>

### LockManager.CR ⇒ <code>Number</code>
Returns bit flag for "Concurrent Read" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.CW"></a>

### LockManager.CW ⇒ <code>Number</code>
Returns bit flag for "Concurrent Write" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.EX"></a>

### LockManager.EX ⇒ <code>Number</code>
Returns bit flag for "Exclusive" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.NL"></a>

### LockManager.NL ⇒ <code>Number</code>
Returns bit flag for "Null" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.PR"></a>

### LockManager.PR ⇒ <code>Number</code>
Returns bit flag for "Protected Read" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.PW"></a>

### LockManager.PW ⇒ <code>Number</code>
Returns bit flag for "Protected Write" lock mode.

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.CODES"></a>

### LockManager.CODES ⇒ <code>Array</code>
Returns array containing short (two-letter) descriptions of all known lock modes sorted exclusivity:
['EX', 'PW', 'PR', 'CW', 'CR', 'NL']

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.MODES"></a>

### LockManager.MODES ⇒ <code>Array</code>
Returns array containing all known lock modes sorted by exclusivity:
[EX, PW, PR, CW, CR, NL]

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.TYPES"></a>

### LockManager.TYPES ⇒ <code>Array</code>
Returns array containing short (two-letter) descriptions of all known lock modes sorted exclusivity:
['Exclusive', 'Protected Write', 'Protected Read', 'Concurrent Write', 'Concurrent Read', 'Null']

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
