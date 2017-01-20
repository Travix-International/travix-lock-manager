/**
 * Lock class. Represents a particular lock on a resource.
 *
 * @propety {String} key - Key this lock associated with.
 * @propety {Number} mode - Bit flag representing mode (level of exclusivity) of this lock.
 * @propety {Any} owner - Arbitrary value denoting the owner of this lock.
 * @propety {Lock} parent - Parent lock if any.
 * @propety {Boolean} primary - Logical value indicating whether this lock is the primary lock or is captured on the parent key.
 */
class Lock {
  /**
   * Returns code (short two-letter description) of this lock mode.
   *
   * @return {String}
   */
  get code() {}

  /**
   * Returns type (long description) of this lock mode.
   *
   * @return {String}
   */
  get type() {}

  /**
   * Returns string representation of this lock in format: Lock of "key" [by "owner"] for "type". Owner is included only if it was specified.
   *
   * @return {String}
   */
  toString() {}
}

/**
 * LockManager class. Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity. All locks are initially kept in memory but can be distributed or replicated via `acquired` and `releasing` event handlers (synchronous or asynchronous).
 * @see (@link https://en.wikipedia.org/wiki/Distributed_lock_manager)
 * 
 * @property {Number} CR - Concurrent Read lock mode bit flag.
 * @property {Number} CW - Concurrent Write lock mode bit flag.
 * @property {Number} EX - Exclusive lock mode bit flag.
 * @property {Number} NL - Null lock mode bit flag.
 * @property {Number} PR - Protected Read lock mode bit flag.
 * @property {Number} PW - Protected Write lock mode bit flag.
 */
class LockManager {
  /**
   * Creates new instance of the LockManager class.
   *
   * @param {Object} [config = {}] - A configuration object.
   * @param {Function} [config.acquired = noop] - The `acquired` event handler. A function called each time when new locks are acquired or existing locks are prolonged with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being acquired will be removed (rollback semantics).
   * @param {String} [config.comparer = (a, b) => a === b] - Comparison function used to determine eqality of any two owners. Should return truthy value if owners are equal; falsy value otherwise.
   * @param {String} [config.delimiter = '/'] - String delimiter used to split hierarchical keys.
   * @param {String} [config.Error = Error] - Error class to use when throwing error that some of requested locks cannot be acquired.
   * @param {Function} [config.releasing = noop] - The `released` event handler. A function called each time when existing locks are released with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being released will be kept (rollback semantics).
   * @param {Number} [config.timeout = 0] - Expiration period of a lock, in milliseconds.
   *
   * @return {LockManager}
   */
  constructor(config) {}

  /**
   * Returns array of acquired keys.
   *
   * @return {Array}
   */
  get keys() {}

  /**
   * Returns array of acquired locks.
   *
   * @return {Array}
   */
  get locks() {}

  /**
   * Asynchronously acquires or prolongs single or multiple locks. When multiple locks are being acquired, this operation acts via "all or nothing" principle. If at least one lock is failed to acquire, no locks will be acquired.
   * 
   * @param {Array|String|Object} key - String key or lock object or array of string keys or array of lock objects to be acquired. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties.
   * @param {Array|Number} [mode = EX] - Single lock mode or bitwise combination ( PW | CR) of lock modes to acquire. Multiple modes are attempted in order from most restrictive to less restrictive. Use the correponsing constants exported by this module.
   * @param {String} [owner] - Lock owner. Arbitrary value denoting a lock owner.
   * 
   * @return {Promise} A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `acquired` event handler or error stating that not all the requested locks could be acquired.
   */
  acquire(key, mode, owner) {}

  /**
   * Returns human readable string describing specified lock mode.
   * 
   * @param {Number|String} mode - Lock mode to describe.
   * @param {boolean} [short = false] - Type of description to return: short (2 letters) or long.
   * 
   * @return {String} Human readable description of the mode.
   */
  describe(mode, short) {}

  /**
   * Exports all existing locks or all the locks corresponding to specified keys.
   * 
   * @param {String} [key = null] - Key or array of keys to limit selection with. If omitted, all existing locks will be exported.
   * 
   * @return {Set} Set of selected locks.
   */
  export(key) {}

  /**
   * Asynchronously releases single or multiple locks. When multiple locks are being released, this operation acts via "at least anything" principle. If one lock is failed to release, other locks will still be released.
   * 
   * @param {Array|String|Object|Null} - String key or lock object or array of string keys or array of lock objects to be release. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties. If null was passed, all the locks with the specified mode and belonging to the specified owner will be released.
   * @param {Number} [mode = EX] - Single lock mode or bitwise combination ( PW | CR) of lock modes to release. Use the correponsing constants exported by this module.
   * @param {Any} [owner] - Lock owner. Arbitrary value denoting a lock owner.
   * 
   * @return {Promise} A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `releasing` event handler.
   */
  release(key, mode, owner) {}
}
