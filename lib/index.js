var qs = require('querystring');

var _ = require('lodash');
var str2json = require('string-to-json');

exports = module.exports = {};

var internals = {};

internals.isNumber = function (val) {
  return (val.match(/^\d$/g) !== null);
};

internals.isArray = function (obj) {
  for (var prop in obj) {
    if (internals.isNumber(prop)) {
      return true;
    }
  }

  return false;
};

internals.transform = function (kva) {
  var values = _.cloneDeep(kva);
  var nested;

  kva = [];

  for (var prop in values) {
    nested = values[prop];
    if (_.isObject(nested)) {
      kva.push(internals.flatten(nested));
    } else {
      kva.push(nested);
    }
  }

  return kva;
};

internals.flatten = function (obj) {
  var keyset = _.keys(obj);

  return (function _flatten(index) {
    var key = keyset[index];

    if (_.isObject(obj[key])) {
      if (internals.isArray(obj[key])) {
        obj[key] = internals.transform(obj[key]);
      } else {
        obj[key] = internals.flatten(obj[key]);
      }
    }

    if (index === keyset.length) {
      return obj;
    }

    return _flatten(index + 1);
  }(0));
};

exports.parse = function (nvp) {
  return internals.flatten(str2json.convert(qs.parse(nvp)));
};

exports.stringify = function (obj) {
  // returns an nvp string
  return '';
};
