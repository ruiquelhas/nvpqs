var qs = require('querystring');

var _ = require('lodash');
var string = require('string');

var Parser = require('dot-object');

exports = module.exports = {};

var internals = {};

internals.customize = function (del, sep) {
  del = del && !string(del).isAlphaNumeric() &&
    del !== sep ? del : '.';

  sep = sep && !string(sep).isAlphaNumeric() &&
    sep !== del ? sep : '&';

  return { del: del, sep: sep };
};

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

exports.parse = function (nvp, del, sep) {
  var custom = internals.customize(del, sep);
  var transformable = qs.parse(nvp, custom.sep);

  var parser = new Parser(custom.del);
  parser.object(transformable);

  return internals.parse(transformable);
};

exports.stringify = function (input, del, sep) {
  var output = {};
  var custom = internals.customize(del, sep);

  function _stringify(obj, current) {
    var value, dotNotationKey;

    for (var key in obj) {
      value = obj[key];
      dotNotationKey = (current ? [current, key].join(custom.del) : key);

      if (_.isObject(value)) {
        _stringify(value, dotNotationKey);
      } else {
        output[dotNotationKey] = value;
      }
    }

    return output;
  }

  return qs.stringify(_stringify(input), custom.sep);
};
