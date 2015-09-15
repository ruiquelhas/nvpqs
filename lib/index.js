'use strict';

var Qs = require('querystring');

var _isObject = require('lodash.isobject');
var _keys = require('lodash.keys');
var _cloneDeep = require('lodash.clonedeep');

var Strings = require('string');

var Parser = require('dot-object');

var internals = {};


internals.customize = function (del, sep, eq) {

    var cdel = del && !Strings(del).isAlphaNumeric() &&
        del !== sep && del !== eq ? del : '.';

    var csep = sep && !Strings(sep).isAlphaNumeric() &&
        sep !== del && sep !== eq ? sep : '&';

    var ceq = eq && !Strings(eq).isAlphaNumeric() &&
        eq !== del && eq !== sep ? eq : '=';

    return {
        del: cdel,
        sep: csep,
        eq: ceq
    };
};


internals.isArray = function (obj) {

    for (var key in obj) {
        if (Strings(key).isNumeric()) {
            return true;
        }
    }

    return false;
};


internals.transform = function (kva) {

    var values = _cloneDeep(kva);
    var nested;

    kva = [];

    for (var key in values) {
        nested = values[key];
        if (_isObject(nested)) {
            kva.push(internals.parse(nested));
        } else {
            kva.push(nested);
        }
    }

    return kva;
};


internals.parse = function (obj) {

    var keyset = _keys(obj);

    var parseItem = function (index) {

        var key = keyset[index];

        if (_isObject(obj[key])) {
            if (internals.isArray(obj[key])) {
                obj[key] = internals.transform(obj[key]);
            } else {
                obj[key] = internals.parse(obj[key]);
            }
        }

        if (index === keyset.length) {
            return obj;
        }

        return parseItem(index + 1);
    };

    return parseItem(0);
};


exports.parse = function (nvp, del, sep, eq) {

    var custom = internals.customize(del, sep, eq);
    var transformable = Qs.parse(nvp, custom.sep, custom.eq);

    var parser = new Parser(custom.del);
    parser.object(transformable);

    return internals.parse(transformable);
};


exports.stringify = function (input, del, sep, eq) {

    var output = {};
    var custom = internals.customize(del, sep, eq);

    var _stringify = function (obj, current) {

        var dotNotationKey, value;

        for (var key in obj) {
            value = obj[key];
            dotNotationKey = (current ? [current, key].join(custom.del) : key);

            if (_isObject(value)) {
                _stringify(value, dotNotationKey);
            } else {
                output[dotNotationKey] = value;
            }
        }

        return output;
    };

    return Qs.stringify(_stringify(input), custom.sep, custom.eq);
};
