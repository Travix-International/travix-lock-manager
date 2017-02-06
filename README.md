# travix-lock-manager

[![NPM](https://nodei.co/npm/travix-lock-manager.png?compact=true)](https://nodei.co/npm/travix-lock-manager)

[![Build Status](https://travis-ci.org/Travix-International/travix-lock-manager.svg)](https://travis-ci.org/Travix-International/travix-lock-manager)
[![Code Climate](https://codeclimate.com/github/Travix-International/travix-lock-manager/badges/gpa.svg)](https://codeclimate.com/github/Travix-International/travix-lock-manager)
[![Test Coverage](https://codeclimate.com/github/Travix-International/travix-lock-manager/badges/coverage.svg)](https://codeclimate.com/github/Travix-International/travix-lock-manager/coverage)

In-memory lock manager for NodeJs helping to serialize access to a set of hierarchically organized resources with various levels of exclusivity.

Supports transactional semantics and can be easily persisted/distributed.
Does not detect deadlocks.

> See more information about [Distributed lock managers](https://en.wikipedia.org/wiki/Distributed_lock_manager) on Wikipedia.

* [Installation](#installation)
* [Usage](#usage)
* [Scripts](#scripts)
* [API](https://github.com/Travix-International/travix-lock-manager/blob/master/doc/API.md)
* [SPEC](https://github.com/Travix-International/travix-lock-manager/blob/master/doc/SPEC.md)

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

To run unit tests and generate test [coverage](https://codeclimate.com/github/Travix-International/travix-lock-manager/coverage) report:

```
$ npm run test
```

To generate [documentation](https://github.com/Travix-International/travix-lock-manager/tree/master/doc/) files:

```
$ npm run doc
```

# License

MIT © [Travix International](http://travix.com)
