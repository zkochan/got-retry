'use strict';

/**
 * Dependencies
 */

var isPlainObject = require('is-plain-obj');
var isStream = require('is-stream');
var Promise = require('pinkie-promise');
var assign = require('object-assign');
var retry = require('retry');
var got = require('got');


/**
 * Expose got-retry
 */

module.exports = request;


/**
 * Retry request on network error
 */

function request (url, options, callback) {
  if (isFunction(options)) {
    callback = options;
    options = {};
  }

  if (!isString(url) && !isPlainObject(url)) {
    throw new Error('Parameter `url` must be a string or object, ' + typeof url);
  }

  if (!options) {
    options = {};
  }

  var body = options.body;

  if (body) {
    if (!isString(body) && !Buffer.isBuffer(body) && !isStream.readable(body) && !isPlainObject(body)) {
      throw new Error('options.body must be a ReadableStream, string, Buffer or plain Object');
    }
  }

  // detect whether to
  // trigger a callback or
  // return a promise
  var hasCallback = isFunction(callback);

  if (hasCallback) {
    return asCallback.apply(null, arguments);
  }

  return asPromise.apply(null, arguments);
}

function asCallback (url, options, callback) {
  if (isFunction(options)) {
    callback = options;
    options = {};
  }

  // apply default retry options
  options = assign({}, defaultRetryOptions, options);

  var operation = retry.operation(options);

  operation.attempt(function () {
    got(url, options, function (err) {
      if (isNetworkError(err) && operation.retry(err)) {
        return;
      }

      callback.apply(null, arguments);
    });
  });
}

function asPromise (url, options) {
  // apply default retry options
  options = assign({}, defaultRetryOptions, options);

  var operation = retry.operation(options);

  return new Promise(function (resolve, reject) {
    operation.attempt(function () {
      got(url, options)
        .then(resolve)
        .catch(function (err) {
          if (isNetworkError(err) && operation.retry(err)) {
            return;
          }

          reject(err);
        });
    });
  });
}


/**
 * Default retry options
 */

var defaultRetryOptions = {
  retries: 2
};


/**
 * Assign shortcuts
 */

var methods = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
];

methods.forEach(function (method) {
  request[method] = function (url, options, callback) {
    if (isFunction(options)) {
      callback = options;
      options = {};
    }

    options = assign({}, options, { method: method.toUpperCase() });

    return request(url, options, callback);
  };
});

// proxy stream function without error handling
request.stream = got.stream;


/**
 * Assign error classes
 */

var errors = [
  'RequestError',
  'ReadError',
  'ParseError',
  'HTTPError',
  'MaxRedirectsError'
];

errors.forEach(function (error) {
  request[error] = got[error];
});


/**
 * Helpers & utilities
 */

function isString (str) {
  return typeof str === 'string';
}

function isFunction (fn) {
  return typeof fn === 'function';
}

function isNetworkError (err) {
  return err instanceof got.RequestError;
}
