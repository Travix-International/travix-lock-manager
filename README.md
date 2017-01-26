# travix-lock-manager

[![npm](https://img.shields.io/npm/v/travix-lock-manager.svg)](https://www.npmjs.com/package/travix-lock-manager)
[![Build Status](https://img.shields.io/travis/Travix-International/travix-lock-manager/master.svg)](https://travis-ci.org/Travix-International/travix-lock-manager)
[![Code Climate](https://img.shields.io/codeclimate/github/Travix-International/travix-lock-manager.svg)](https://codeclimate.com/github/Travix-International/travix-lock-manager)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/Travix-International/travix-lock-manager.svg)](https://codeclimate.com/github/Travix-International/travix-lock-manager/coverage)
[![Issues](https://img.shields.io/codeclimate/issues/github/Travix-International/travix-lock-manager.svg)](https://codeclimate.com/github/Travix-International/travix-lock-manager/issues)

In-memory lock manager for NodeJs helping to serialize access to a set of hierarchically organized resources with various levels of exclusivity.

Supports transactional semantics and can be easily persisted/distributed.
Does not detect deadlocks.

> See more information about [Distributed lock managers](https://en.wikipedia.org/wiki/Distributed_lock_manager) on Wikipedia.

* [Installation](#installation)
* [Usage](#usage)
* [Scripts] (#scripts)
* [API](https://github.com/Travix-International/travix-lock-manager/blob/master/DOC.md)
* [Spec](https://github.com/Travix-International/travix-lock-manager/blob/master/SPEC.md)

## Installation

Install it via [npm](https://npmjs.com):

```
$ npm install --save travix-lock-manager
```

## Usage

```js
const { CR, CW, EX, NL, PR, PW } = LockManager;

const manager = new LockManager({
  onacquire: locks => console.log(
    'Acquired:',
    ...locks.map(lock => lock.toString())
  ),
  onrelease: locks => console.log(
    'Released:',
    ...locks.map(lock => lock.toString())
  )
});

manager.acquire('resource');
// Acquired: Lock of "resource" for "Exclusive"
manager.release('resource');
// Released: Lock of "resource" for "Exclusive"

manager.acquire('resource', PW, 'owner1');
// Acquired: Lock of "resource" by "owner1" for "Protected Write"
manager.acquire('resource', PW, 'owner2');
// Error: Some requested locks cannot be acquired
manager.acquire('resource', PW | CR, 'owner2');
// Acquired: Lock of "resource" by "owner2" for "Concurrent Read"
manager.acquire(['resource/a', 'resource/b'], NL, 'owner3');
// Acquired: Lock of "resource/a" by "owner3" for "Null" Lock of "resource/b" by "owner3" for "Null"
manager.release(null, NL, 'owner3');
// Released: Lock of "resource/a" by "owner3" for "Null" Lock of "resource/b" by "owner3" for "Null"
manager.keys;
// [ '', 'resource' ]
manager.locks;
/*
[
  Lock { key: '', mode: 4, owner: 'owner1' },
  Lock { key: '', mode: 2, owner: 'owner2' },
  Lock { key: 'resource', mode: 16, owner: 'owner1' },
  Lock { key: 'resource', mode: 2, owner: 'owner2' }
]
*/
manager.describe(CW);
// 'Concurrent Write'
manager.select('resource');
/*
Set {
  Lock { key: 'resource', mode: 16, owner: 'owner1' },
  Lock { key: 'resource', mode: 2, owner: 'owner2' }
}
*/
```

## Scripts

To run linting of source code and unit tests:

```
$ npm run lint
```

To run unit tests and generate coverage report:

```
$ npm run test
```

To generate [SPEC.md](https://github.com/Travix-International/travix-lock-manager/blob/master/DOC.md) file from documenting comments:

```
$ npm run doc
```

To generate [SPEC.md](https://github.com/Travix-International/travix-lock-manager/blob/master/SPEC.md) file from test specifications:

```
$ npm run spec
```

# License

MIT © [Travix International](http://travix.com)
