/**
 * LockManager class. Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity. All locks are initially kept in memory but can be distributed or replicated via `onacquire` and `onrelease` event handlers (both synchronous or asynchronous).
  */
class LockManager {
  /**
   * Creates new instance of the LockManager class.
   *
   * @param {Object} [config = {}] - A configuration object.
   * @param {String} [config.comparer = (a, b) => a === b] - Comparison function used to determine eqality of any two owners. Should return truthy value if owners are equal; falsy value otherwise.
   * @param {String} [config.delimiter = '/'] - String delimiter used to split hierarchical keys.
   * @param {String} [config.AcquisitionError = Error] - Error class to use when throwing error that some of requested locks cannot be acquired.
   * @param {Function} [config.onacquire] - The `acquired` event handler. A function called each time when new locks are acquired or existing locks are prolonged with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being acquired will be removed (rollback semantics).
   * @param {Function} [config.onrelease] - The `releasing` event handler. A function called each time when existing locks are released with one parameter: array of lock objects. If this function throws or returns a promise which eventually rejects, all the locks that are being released will be kept (rollback semantics).
   * @param {Number} [config.timeout = 0] - Expiration period of a lock, in milliseconds.
   *
   * @return {LockManager}
   */
  constructor(config) {}

  /**
   * Returns bit flag for "Concurrent Read" lock mode.
   *
   * @return {Number}
   */
  static get CR() {}

  /**
   * Returns bit flag for "Concurrent Write" lock mode.
   *
   * @return {Number}
   */
  static get CW() {}

  /**
   * Returns bit flag for "Exclusive" lock mode.
   *
   * @return {Number}
   */
  static get EX() {}

  /**
   * Returns bit flag for "Null" lock mode.
   *
   * @return {Number}
   */
  static get NL() {}

  /**
   * Returns bit flag for "Protected Read" lock mode.
   *
   * @return {Number}
   */
  static get PR() {}

  /**
   * Returns bit flag for "Protected Write" lock mode.
   *
   * @return {Number}
   */
  static get PW() {}

  /**
   * Returns array containing short (two-letter) descriptions of all known lock modes sorted exclusivity:
   * ['EX', 'PW', 'PR', 'CW', 'CR', 'NL']
   *
   * @return {Array}
   */
  static get CODES() {}

  /**
   * Returns array containing all known lock modes sorted by exclusivity:
   * [EX, PW, PR, CW, CR, NL]
   *
   * @return {Array}
   */
  static get MODES() {}

  /**
   * Returns array containing short (two-letter) descriptions of all known lock modes sorted exclusivity:
   * ['Exclusive', 'Protected Write', 'Protected Read', 'Concurrent Write', 'Concurrent Read', 'Null']
   *
   * @return {Array}
   */
  static get TYPES() {}

  /**
   * Returns array of unique keys of locks that are currently held.
   *
   * @return {Array}
   */
  get keys() {}

  /**
   * Returns array of all locks that are currently held.
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
   * Asynchronously releases single or multiple locks. When multiple locks are being released, this operation acts via "at least anything" principle. If one lock is failed to release, other locks will still be released.
   *
   * @param {Array|String|Object|Null} - String key or lock object or array of string keys or array of lock objects to be release. The lock object may contain optional `key`, `mode` and `owner` properties with defaults to empty string for key and other arguments of this method for other properties. If null was passed, all the locks with the specified mode and belonging to the specified owner will be released.
   * @param {Number} [mode = EX] - Single lock mode or bitwise combination ( PW | CR) of lock modes to release. Use the correponsing constants exported by this module.
   * @param {Any} [owner] - Lock owner. Arbitrary value denoting a lock owner.
   *
   * @return {Promise} A promise resolving to array of locks that were affected by this operation or rejecting with error thrown by the `releasing` event handler.
   */
  release(key, mode, owner) {}

  /**
   * Selects and returns locks corresponding to specified keys and passing predicate check.
   *
   * @param {Array|String} [key = null] - Key or array of keys to limit selection with. If omitted, all existing keys will be considered.
   * @param {Function} [predicate = null] - Function accepting lock argument and returning truthy value if this lock is to be selected.
   *
   * @return {Set} Set of selected locks.
   */
  select(key, predicate) {}
}
