'option strict';

describe('lock', () => {
  describe('.code', () => {
    it('gets short (two-letter) description of the lock mode', async () => {
      const { CODES, MODES } = LockManager;
      const manager = new LockManager;
      for (let i = MODES.length; --i >= 0;) {
        const code = CODES[i];
        const mode = MODES[i];
        const [lock] = await manager.acquire(code, mode);
        expect(lock.code).to.be.a('string').which.equals(code);
      }
    });
  });

  describe('.parent', () => {
    it('gets undefined if lock is acquired on top-level key', async () => {
      const manager = new LockManager;
      const [lock] = await manager.acquire('');
      expect(lock.parent).to.be.undefined;
    });

    it('gets parent lock object if lock is acquired on non-top-level key', async () => {
      const manager = new LockManager;
      const [lock] = await manager.acquire('parent/child');
      expect(lock.parent).to.be.an('object').with.property('key').which.equals('parent');
    });
  });

  describe('.type', () => {
    it('gets long description of the lock mode', async () => {
      const { MODES, TYPES } = LockManager;
      const manager = new LockManager;
      for (let i = MODES.length; --i >= 0;) {
        const mode = MODES[i];
        const type = TYPES[i];
        const [lock] = await manager.acquire(type, mode);
        expect(lock.type).to.be.a('string').which.equals(type);
      }
    });
  });

  describe('.toString()', () => {
    it('returns string containing lock key and type if owner is not specified', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const key = 'key', mode = EX, type = manager.describe(mode);
      const [lock] = await manager.acquire(key, mode);
      expect(lock.toString()).to.be.a('string').and.contain(key).and.contain(type);
    });

    it('returns string containing lock key, owner and type if owner is specified', async () => {
      const { EX } = LockManager;
      const manager = new LockManager;
      const key = 'key', mode = EX, owner = 'owner', type = manager.describe(mode);
      const [lock] = await manager.acquire(key, mode, owner);
      expect(lock.toString()).to.be.a('string').and.contain(key).and.contain(owner).and.contain(type);
    });
  });
});
