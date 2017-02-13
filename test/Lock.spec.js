'option strict';

let manager;

describe('lock', () => {
  beforeEach(() => {
    manager = new LockManager;
  });

  describe('.code', () => {
    it('gets short (two-letter) description of the lock mode', () => {
      const promises = [];
      for (let i = MODES.length; --i >= 0;) {
        const code = CODES[i];
        const mode = MODES[i];
        promises.push(manager
          .acquire(code, mode)
          .then(([lock]) => expect(lock.code)
            .to.be.a('string')
            .and.equal(code)
          )
        );
      }
      return Promise.all(promises);
    });
  });

  describe('.parent', () => {
    it('gets undefined if lock is acquired on top-level key', () =>
      manager
        .acquire('')
        .then(([lock]) => expect(lock.parent).to.be.undefined)
    );

    it('gets parent lock object if lock is acquired on non-top-level key', () =>
      manager
        .acquire('parent/child')
        .then(([lock]) => expect(lock.parent)
          .to.have.property('key')
          .that.equal('parent')
        )
    );
  });

  describe('.type', () => {
    it('gets long description of the lock mode', () => {
      const promises = [];
      for (let i = MODES.length; --i >= 0;) {
        const mode = MODES[i];
        const type = TYPES[i];
        promises.push(manager
          .acquire(type, mode)
          .then(([lock]) => expect(lock.type)
            .to.be.a('string')
            .and.equal(type)
          )
        );
      }
      return Promise.all(promises);
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
