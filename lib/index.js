var qs = require('querystring');

var _ = require('lodash');
var string = require('string');
var str2json = require('string-to-json');

exports = module.exports = {};

var internals = {};

internals.isArray = function (obj) {
  for (var key in obj) {
    if (string(key).isNumeric()) {
      return true;
    }
  }

  return false;
};

internals.transform = function (kva) {
  var values = _.cloneDeep(kva);
  var nested;

  kva = [];

  for (var key in values) {
    nested = values[key];
    if (_.isObject(nested)) {
      kva.push(internals.parse(nested));
    } else {
      kva.push(nested);
    }
  }

  return kva;
};

internals.parse = function (obj) {
  var keyset = _.keys(obj);

  return (function _parse(index) {
    var key = keyset[index];

    if (_.isObject(obj[key])) {
      if (internals.isArray(obj[key])) {
        obj[key] = internals.transform(obj[key]);
      } else {
        obj[key] = internals.parse(obj[key]);
      }
    }

    if (index === keyset.length) {
      return obj;
    }

    return _parse(index + 1);
  }(0));
};

exports.parse = function (nvp) {
  return internals.parse(str2json.convert(qs.parse(nvp)));
};

exports.stringify = function (input, del) {
  var output = {};

  del = del && !string(del).isAlphaNumeric() ? del : '.';

  function _stringify(obj, current) {
    var value, dotNotationKey;

    for (var key in obj) {
      value = obj[key];
      dotNotationKey = (current ? [current, key].join(del) : key);

      if (_.isObject(value)) {
        _stringify(value, dotNotationKey);
      } else {
        output[dotNotationKey] = value;
      }
    }

    return output;
  }

  return qs.stringify(_stringify(input));
};
