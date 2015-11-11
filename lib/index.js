'use strict';

const Qs = require('querystring');

const _isObject = require('lodash.isobject');
const _cloneDeep = require('lodash.clonedeep');

const Parser = require('dot-object');

const internals = {};

internals.isAlphaNumeric = function (value) {

    return (new RegExp(/^[a-zA-Z0-9]$/gi)).test(value);
};

internals.isNumeric = function (value) {

    return (new RegExp(/^\d$/gi)).test(value);
};

internals.isNVPArray = function (obj) {

    return Object.keys(obj).filter(internals.isNumeric).length > 0;
};

internals.customize = function (del, sep, eq) {

    const cdel = del && !internals.isAlphaNumeric(del) &&
        del !== sep && del !== eq ? del : '.';

    const csep = sep && !internals.isAlphaNumeric(sep) &&
        sep !== del && sep !== eq ? sep : '&';

    const ceq = eq && !internals.isAlphaNumeric(eq) &&
        eq !== del && eq !== sep ? eq : '=';

    return {
        del: cdel,
        sep: csep,
        eq: ceq
    };
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

    const keyset = Object.keys(obj);

    const parseItem = function (index) {

        const key = keyset[index];

        if (_isObject(obj[key])) {
            if (internals.isNVPArray(obj[key])) {
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
