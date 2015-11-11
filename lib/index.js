'use strict';

const Qs = require('querystring');

const _isObject = require('lodash.isobject');
const _keys = require('lodash.keys');
const _cloneDeep = require('lodash.clonedeep');

const Strings = require('string');

const Parser = require('dot-object');

const internals = {};


internals.customize = function (del, sep, eq) {

    const cdel = del && !Strings(del).isAlphaNumeric() &&
        del !== sep && del !== eq ? del : '.';

    const csep = sep && !Strings(sep).isAlphaNumeric() &&
        sep !== del && sep !== eq ? sep : '&';

    const ceq = eq && !Strings(eq).isAlphaNumeric() &&
        eq !== del && eq !== sep ? eq : '=';

    return {
        del: cdel,
        sep: csep,
        eq: ceq
    };
};


internals.isArray = function (obj) {

    for (const key in obj) {
        if (Strings(key).isNumeric()) {
            return true;
        }
    }

    return false;
};


internals.transform = function (kva) {

    const values = _cloneDeep(kva);

    kva = [];

    for (const key in values) {
        const nested = values[key];
        if (_isObject(nested)) {
            kva.push(internals.parse(nested));
        }
        else {
            kva.push(nested);
        }
    }

    return kva;
};


internals.parse = function (obj) {

    const keyset = _keys(obj);

    const parseItem = function (index) {

        const key = keyset[index];

        if (_isObject(obj[key])) {
            if (internals.isArray(obj[key])) {
                obj[key] = internals.transform(obj[key]);
            }
            else {
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

    const custom = internals.customize(del, sep, eq);
    const transformable = Qs.parse(nvp, custom.sep, custom.eq);

    const parser = new Parser(custom.del);
    parser.object(transformable);

    return internals.parse(transformable);
};


exports.stringify = function (input, del, sep, eq) {

    const output = {};
    const custom = internals.customize(del, sep, eq);

    const _stringify = function (obj, current) {

        for (const key in obj) {
            const value = obj[key];
            const dotNotationKey = (current ? [current, key].join(custom.del) : key);

            if (_isObject(value)) {
                _stringify(value, dotNotationKey);
            }
            else {
                output[dotNotationKey] = value;
            }
        }

        return output;
    };

    return Qs.stringify(_stringify(input), custom.sep, custom.eq);
};
