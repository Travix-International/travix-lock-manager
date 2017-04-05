/**
 * LockManager class.
 * Helps to serialise access to a set of hierarchically organized resources with various levels of exclusivity.
 * All locks are initially kept in memory but can be distributed or replicated
 * via `onacquire` and `onrelease` event handlers (synchronous or asynchronous)
 * supporting transactional semantics.
  */
class LockManager {
  /**
   * Creates new instance of the LockManager class.
   *
   * @param {Object} [config = {}]
   * A configuration object.
   *
   * @param {String} [config.comparer = (owner1, owner2) => owner1 === owner2]
   * Comparison function used to determine eqality of two owners.
   * Should return truthy value if owners are equal, falsy otherwise.
   * Useful when owners are represented as profile objects containing some unique property (like email).
   *
   * @param {String} [config.delimiter = '/']
   * String delimiter used to split hierarchical keys.
   *
   * @param {String} [config.AcquireError = Error]
   * Constructor function creating error object to denote the "some locks cannot be acquired" error.
   * Accepts 2 arguments: string error message and array of failed locks. Each failed lock will contain conflict property pointing to the conflicting lock.
   *
   * @param {Function} [config.onacquire]
   * A function called each time when new locks are acquired or existing locks are prolonged.
   * Accepts one parameter: array of lock objects.
   * If this function throws an error or returns a promise which eventually rejects,
   * all the locks that are being acquired will be removed (rollback semantics).
   *
   * @param {Function} [config.onrelease]
   * A function called each time when existing locks are released.
   * Accepts one parameter: array of lock objects.
   * If this function throws an error or returns a promise which eventually rejects,
   * all the locks that are being released will be kept (rollback semantics).
   *
   * @param {Number} [config.timeout = 0]
   * Expiration period of a lock, in milliseconds.
   * After this period elapses the lock will be automatically released.
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
   * Returns array containing short descriptions of all known lock modes sorted by exclusivity:
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
   * Returns array containing long descriptions of all known lock modes sorted by exclusivity:
   * ['Exclusive', 'Protected Write', 'Protected Read', 'Concurrent Write', 'Concurrent Read', 'Null']
   *
   * @return {Array}
   */
  static get TYPES() {}

  /**
   * Returns array containing unique keys of all locks that are currently held.
   *
   * @return {Array}
   */
  get keys() {}

  /**
   * Returns array containing all locks that are currently held.
   *
   * @return {Array}
   */
  get locks() {}

  /**
   * Asynchronously acquires or prolongs single or multiple locks.
   * When multiple locks are being acquired, this operation acts according the "all or nothing" principle.
   * If some locks cannot be acquired or `onacquire` event handler throws (rejects to) an error
   * no locks will be acquired.
   *
   * @param {Array|String|Object} items
   * String key or lock object or array of string keys or array of lock objects to be acquired.
   * The lock object must contain `key` property.
   * Also it may contain `mode` and `owner` properties defaulting to the matching arguments of this method.
   *
   * @param {Number} [mode = EX]
   * Single lock mode or bitwise combination ( PW | CR) of lock modes to acquire.
   * Combined modes are attempted in order from the most restrictive.
   * That is the most possible exclusive mode will be eventually acquired.
   *
   * @param {String} [owner]
   * Arbitrary value denoting a lock owner.
   *
   * @return {Promise}
   * A promise resolving to array of locks that were acquired or prolonged by this operation,
   * or rejecting with the error thrown by `onacquire` event handler
   * or rejecting with new instance of `AcquireError`.
   */
  acquire(items, mode, owner) {}

  /**
   * Returns string describing specified lock mode.
   *
   * @param {Number|String} mode
   * Lock mode to describe.
   *
   * @param {boolean} [short = false]
   * Type of description to return: short (true) or long (false).
   *
   * @return {String}
   * Description of lock mode.
   */
  describe(mode, short) {}

  /**
   * Asynchronously releases single or multiple locks.
   * When multiple locks are being released, this operation acts according the "anything" principle.
   * If some locks cannot be released, other passed locks will still be released.
   * But if `onacquire` event handler throws an error, all locks being released will be restored.
   *
   * @param {Array|String|Object|Null}
   * String key or lock object or array of string keys or array of lock objects to be released.
   * Or null (undefined) to release matching locks for all existing keys.
   * The lock object must contain `key` property.
   * Also it may contain `mode` and `owner` properties defaulting to the matching arguments of this method.
   *
   * @param {Number} [mode = EX]
   * Single lock mode or bitwise combination ( PW | CR) of lock modes to release.
   *
   * @param {Any} [owner]
   * Arbitrary value denoting a lock owner.
   *
   * @return {Promise}
   * A promise resolving to array of locks that were released
   * or rejecting with the error thrown by `onrelease` event handler.
   */
  release(key, mode, owner) {}

  /**
   * Selects and returns locks corresponding to the specified keys and predicate check.
   *
   * @param {Array|String} [key = null]
   * Key or array of keys to limit selection with.
   * If omitted, all existing keys will be selected.
   *
   * @param {Function} [predicate = null]
   * Function accepting lock argument and returning truthy value if this lock should be selected.
   *
   * @return {Set}
   * Set of selected locks.
   */
  select(key, predicate) {}
}
