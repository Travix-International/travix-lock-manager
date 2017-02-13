## Classes

<dl>
<dt><a href="#Lock">Lock</a></dt>
<dd><p>Lock class. Represents a particular lock on a resource.</p>
</dd>
<dt><a href="#LockManager">LockManager</a></dt>
<dd><p>LockManager class.
Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity.
All locks are initially kept in memory but can be distributed or replicated
via <code>onacquire</code> and <code>onrelease</code> event handlers (synchronous or asynchronous)
supporting transactional semantics.</p>
</dd>
</dl>

<a name="Lock"></a>

## Lock
Lock class. Represents a particular lock on a resource.

**Kind**: global class  
**Propety**: <code>String</code> key
Key of this lock.  
**Propety**: <code>Number</code> mode
Bit flag representing mode (level of exclusivity) of this lock.  
**Propety**: <code>Any</code> owner
Arbitrary value denoting the owner of this lock.  
**Propety**: <code>[Lock](#Lock)</code> parent
Parent lock if any.  
**Propety**: <code>Boolean</code> primary
Logical value indicating whether this lock is the primary lock or is captured on the parent key.  

* [Lock](#Lock)
    * [.code](#Lock+code) ⇒ <code>String</code>
    * [.type](#Lock+type) ⇒ <code>String</code>
    * [.toString()](#Lock+toString) ⇒ <code>String</code>

<a name="Lock+code"></a>

### lock.code ⇒ <code>String</code>
Returns code (short description) of this lock mode.

**Kind**: instance property of <code>[Lock](#Lock)</code>  
<a name="Lock+type"></a>

### lock.type ⇒ <code>String</code>
Returns type (long description) of this lock mode.

**Kind**: instance property of <code>[Lock](#Lock)</code>  
<a name="Lock+toString"></a>

### lock.toString() ⇒ <code>String</code>
Returns string representation of this lock in format:
Lock of "key" [by "owner"] for "type".
Owner is included only if it has been specified.

**Kind**: instance method of <code>[Lock](#Lock)</code>  
<a name="LockManager"></a>

## LockManager
LockManager class.
Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity.
All locks are initially kept in memory but can be distributed or replicated
via `onacquire` and `onrelease` event handlers (synchronous or asynchronous)
supporting transactional semantics.

**Kind**: global class  

* [LockManager](#LockManager)
    * [new LockManager([config])](#new_LockManager_new)
    * _instance_
        * [.keys](#LockManager+keys) ⇒ <code>Array</code>
        * [.locks](#LockManager+locks) ⇒ <code>Array</code>
        * [.acquire(items, [mode], [owner])](#LockManager+acquire) ⇒ <code>Promise</code>
        * [.describe(mode, [short])](#LockManager+describe) ⇒ <code>String</code>
        * [.release(String, [mode], [owner])](#LockManager+release) ⇒ <code>Promise</code>
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
    - [.comparer] <code>String</code> <code> = (owner1, owner2) =&gt; owner1 === owner2</code> - Comparison function used to determine eqality of two owners.
Should return truthy value if owners are equal, falsy otherwise.
Useful when owners are represented as profile objects containing some unique property (like email).
    - [.delimiter] <code>String</code> <code> = &#x27;/&#x27;</code> - String delimiter used to split hierarchical keys.
    - [.AcquireError] <code>String</code> <code> = Error</code> - Constructor function creating error object to denote the "some locks cannot be acquired" error.
Accepts 2 arguments: string message and array of failed locks.
    - [.onacquire] <code>function</code> - A function called each time when new locks are acquired or existing locks are prolonged.
Accepts one parameter: array of lock objects.
If this function throws an error or returns a promise which eventually rejects,
all the locks that are being acquired will be removed (rollback semantics).
    - [.onrelease] <code>function</code> - A function called each time when existing locks are released.
Accepts one parameter: array of lock objects.
If this function throws an error or returns a promise which eventually rejects,
all the locks that are being released will be kept (rollback semantics).
    - [.timeout] <code>Number</code> <code> = 0</code> - Expiration period of a lock, in milliseconds.
After this period elapses the lock will be automatically released.

<a name="LockManager+keys"></a>

### lockManager.keys ⇒ <code>Array</code>
Returns array containing unique keys of all locks that are currently held.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager+locks"></a>

### lockManager.locks ⇒ <code>Array</code>
Returns array containing all locks that are currently held.

**Kind**: instance property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager+acquire"></a>

### lockManager.acquire(items, [mode], [owner]) ⇒ <code>Promise</code>
Asynchronously acquires or prolongs single or multiple locks.
When multiple locks are being acquired, this operation acts according the "all or nothing" principle.
If some locks cannot be acquired or `onacquire` event handler throws (rejects to) an error
no locks will be acquired.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Promise</code> - A promise resolving to array of locks that were acquired or prolonged by this operation,
or rejecting with the error thrown by `onacquire` event handler
or rejecting with new instance of `AcquireError`.  
**Params**

- items <code>Array</code> | <code>String</code> | <code>Object</code> - String key or lock object or array of string keys or array of lock objects to be acquired.
The lock object must contain `key` property.
Also it may contain `mode` and `owner` properties defaulting to the matching arguments of this method.
- [mode] <code>Number</code> <code> = EX</code> - Single lock mode or bitwise combination ( PW | CR) of lock modes to acquire.
Combined modes are attempted in order from the most restrictive.
That is the most possible exclusive mode will be eventually acquired.
- [owner] <code>String</code> - Arbitrary value denoting a lock owner.

<a name="LockManager+describe"></a>

### lockManager.describe(mode, [short]) ⇒ <code>String</code>
Returns string describing specified lock mode.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>String</code> - Description of lock mode.  
**Params**

- mode <code>Number</code> | <code>String</code> - Lock mode to describe.
- [short] <code>boolean</code> <code> = false</code> - Type of description to return: short (true) or long (false).

<a name="LockManager+release"></a>

### lockManager.release(String, [mode], [owner]) ⇒ <code>Promise</code>
Asynchronously releases single or multiple locks.
When multiple locks are being released, this operation acts according the "anything" principle.
If some locks cannot be released, other passed locks will still be released.
But if `onacquire` event handler throws an error, all locks being released will be restored.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Promise</code> - A promise resolving to array of locks that were released
or rejecting with the error thrown by `onrelease` event handler.  
**Params**

- String <code>Array</code> | <code>String</code> | <code>Object</code> | <code>Null</code> - key or lock object or array of string keys or array of lock objects to be released.
Or null (undefined) to release matching locks for all existing keys.
The lock object must contain `key` property.
Also it may contain `mode` and `owner` properties defaulting to the matching arguments of this method.
- [mode] <code>Number</code> <code> = EX</code> - Single lock mode or bitwise combination ( PW | CR) of lock modes to release.
- [owner] <code>Any</code> - Arbitrary value denoting a lock owner.

<a name="LockManager+select"></a>

### lockManager.select([key], [predicate]) ⇒ <code>Set</code>
Selects and returns locks corresponding to the specified keys and predicate check.

**Kind**: instance method of <code>[LockManager](#LockManager)</code>  
**Returns**: <code>Set</code> - Set of selected locks.  
**Params**

- [key] <code>Array</code> | <code>String</code> <code> = </code> - Key or array of keys to limit selection with.
If omitted, all existing keys will be selected.
- [predicate] <code>function</code> <code> = </code> - Function accepting lock argument and returning truthy value if this lock should be selected.

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
Returns array containing short descriptions of all known lock modes sorted by exclusivity:
['EX', 'PW', 'PR', 'CW', 'CR', 'NL']

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.MODES"></a>

### LockManager.MODES ⇒ <code>Array</code>
Returns array containing all known lock modes sorted by exclusivity:
[EX, PW, PR, CW, CR, NL]

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
<a name="LockManager.TYPES"></a>

### LockManager.TYPES ⇒ <code>Array</code>
Returns array containing long descriptions of all known lock modes sorted by exclusivity:
['Exclusive', 'Protected Write', 'Protected Read', 'Concurrent Write', 'Concurrent Read', 'Null']

**Kind**: static property of <code>[LockManager](#LockManager)</code>  
