# got-retry [![Circle CI](https://circleci.com/gh/vdemedes/got-retry.svg?style=svg)](https://circleci.com/gh/vdemedes/got-retry)

Retry [got](https://npmjs.org/package/got) request on network error (EAI_AGAIN, ENOTFOUND, ETIMEDOUT, etc).


### Features

- 100% identical API
- Original **got** test suite passes
- Avoid issues caused by random network issues
- Does not have a **got** dependency set, install it yourself
- Retry functionality is based on the battle-tested `retry` package


### Installation

```
$ npm install got --save
$ npm install got-retry --save
```


### Usage

Instead of:

```javascript
const got = require('got');

got('https://www.roqet.io')
  .then(function () {
    // done
  });
```

Just require `got-retry` and you are all set:

```javascript
const got = require('got-retry');

got('https://www.roqet.io')
  .then(function () {
    // done
  });
```


### Tests

[![Circle CI](https://circleci.com/gh/vdemedes/got-retry.svg?style=svg)](https://circleci.com/gh/vdemedes/got-retry)

Included tests are unmodified tests from `got` package.

```
$ make test
```


### License

got-retry is released under the MIT license.
