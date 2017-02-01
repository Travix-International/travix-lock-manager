'option strict';

let manager;

describe('lock', () => {
  beforeEach(() => {
    manager = new LockManager;
  });

  describe('.code', () => {
    it('returns short (two-letter) description of the lock mode', () => {
      for (let i = MODES.length; --i >= 0;) {
        const code = CODES[i];
        const mode = MODES[i];
        return manager
          .acquire(code, mode)
          .then(([lock]) => expect(lock.code)
            .to.be.a('string')
            .and.equal(code)
          );
      }
    });
  });

  describe('.type', () => {
    it('returns long description of the lock mode', () => {
      for (let i = MODES.length; --i >= 0;) {
        const mode = MODES[i];
        const type = TYPES[i];
        return manager
          .acquire(type, mode)
          .then(([lock]) => expect(lock.type)
            .to.be.a('string')
            .and.equal(type)
          );
      }
    });
  });

  describe('.toString()', () => {
    it('returns string containing lock key and type if owner is not specified', () => {
      const key = 'key', mode = EX;
      return manager
        .acquire('key', EX)
        .then(([lock]) => expect(lock.toString())
          .to.be.a('string')
          .and.contain(key)
          .and.contain(manager.describe(mode))
        );
    });

    it('returns string containing lock key, type and owner if owner is specified', () => {
      const key = 'key', mode = EX, owner = 'owner';
      return manager
        .acquire('key', EX, 'owner')
        .then(([lock]) => expect(lock.toString())
          .to.be.a('string')
          .and.contain(key)
          .and.contain(manager.describe(mode))
          .and.contain(owner)
        );
    });
  });
});
