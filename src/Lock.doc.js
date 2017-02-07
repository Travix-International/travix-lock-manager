/**
 * Lock class. Represents a particular lock on a resource.
 *
 * @propety {String} key
 * Key of this lock.
 *
 * @propety {Number} mode
 * Bit flag representing mode (level of exclusivity) of this lock.
 *
 * @propety {Any} owner
 * Arbitrary value denoting the owner of this lock.
 *
 * @propety {Lock} parent
 * Parent lock if any.
 *
 * @propety {Boolean} primary
 * Logical value indicating whether this lock is the primary lock or is captured on the parent key.
 */
class Lock {
  /**
   * Returns code (short description) of this lock mode.
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
   * Returns string representation of this lock in format:
   * Lock of "key" [by "owner"] for "type".
   * Owner is included only if it has been specified.
   *
   * @return {String}
   */
  toString() {}
}

