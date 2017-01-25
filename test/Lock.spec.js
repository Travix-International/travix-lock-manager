'option strict';

let manager;

describe('lock', () => {
  beforeEach(() => {
    manager = new LockManager;
  });

  describe('.code', () => {
    it('returns short (two-letter) description of the lock mode', async () => {
      for (let i = MODES.length; --i >= 0;) {
        const code = CODES[i];
        const mode = MODES[i];
        const [lock] = await manager.acquire(code, mode);
        expect(lock.code).to.be.a('string')
          .and.equal(code);
      }
    });
  });

  describe('.type', () => {
    it('returns long description of the lock mode', async () => {
      for (let i = MODES.length; --i >= 0;) {
        const mode = MODES[i];
        const type = TYPES[i];
        const [lock] = await manager.acquire(type, mode);
        expect(lock.type).to.be.a('string')
          .and.equal(type);
      }
    });
  });

  describe('.toString()', () => {
    it('returns string containing lock key and type if owner is not specified', async () => {
      const key = 'key', mode = EX;
      const [lock] = await manager.acquire('key', EX);
      expect(lock.toString()).to.be.a('string')
        .and.contain(key)
        .and.contain(manager.describe(mode));
    });

    it('returns string containing lock key, type and owner if owner is specified', async () => {
      const key = 'key', mode = EX, owner = 'owner';
      const [lock] = await manager.acquire('key', EX, 'owner');
      expect(lock.toString()).to.be.a('string')
        .and.contain(key)
        .and.contain(manager.describe(mode))
        .and.contain(owner);
    });
  });
});
