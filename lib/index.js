var qs = require('querystring');

var _ = require('lodash');
var string = require('string');

var Parser = require('dot-object');

exports = module.exports = {};

var internals = {};

internals.customize = function (del, sep, eq) {
  var cdel, csep, ceq;

  cdel = del && !string(del).isAlphaNumeric() &&
    del !== sep && del !== eq ? del : '.';

  csep = sep && !string(sep).isAlphaNumeric() &&
    sep !== del && sep !== eq ? sep : '&';

  ceq = eq && !string(eq).isAlphaNumeric() &&
    eq !== del && eq !== sep ? eq : '=';

  return { del: cdel, sep: csep, eq: ceq };
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

exports.parse = function (nvp, del, sep, eq) {
  var custom = internals.customize(del, sep, eq);
  var transformable = qs.parse(nvp, custom.sep, custom.eq);

  var parser = new Parser(custom.del);
  parser.object(transformable);

  return internals.parse(transformable);
};

exports.stringify = function (input, del, sep, eq) {
  var output = {};
  var custom = internals.customize(del, sep, eq);

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

  return qs.stringify(_stringify(input), custom.sep, custom.eq);
};
