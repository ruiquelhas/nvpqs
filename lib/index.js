'use strict';

const Qs = require('querystring');

const isObject = require('lodash.isobject');
const reduce = require('lodash.reduce');
const some = require('lodash.some');
const transform = require('lodash.transform');

const Parser = require('dot-object');

const internals = {};

internals.isAlphaNumeric = function (value) {

    return (new RegExp(/^[a-zA-Z0-9]$/gi)).test(value);
};

internals.isNumeric = function (value) {

    return (new RegExp(/^\d$/gi)).test(value);
};

internals.assign = function (value, remaining, fallback) {

    return value && !internals.isAlphaNumeric(value) &&
        remaining.indexOf(value) === -1 ? value : fallback;
};

internals.transform = function (array) {

    return reduce(array, (result, value) => {

        if (isObject(value)) {
            result.push(internals.parse(value));
        }
        else {
            result.push(value);
        }

        return result;
    }, []);
};

internals.parse = function (obj) {

    return transform(obj, (result, value, key) => {

        const isArray = some(Object.keys(value), internals.isNumeric);

        if (isObject(value) && isArray) {
            result[key] = internals.transform(value);
        }
        else if (isObject(value) && !isArray) {
            result[key] = internals.parse(value);
        }
        else {
            result[key] = value;
        }
    });
};

internals.stringify = function (obj, del, current) {

    return transform(obj, (result, value, key) => {

        const builder = (current ? [current, key].join(del) : key);

        if (isObject(value)) {
            Object.assign(result, internals.stringify(value, del, builder));
        }
        else {
            result[builder] = value;
        }
    });
};

exports.parse = function (nvp, del, sep, eql) {

    del = internals.assign(del, [sep, eql], '.');
    sep = internals.assign(sep, [del, eql], '&');
    eql = internals.assign(eql, [del, sep], '=');

    const transformable = Qs.parse(nvp, sep, eql);
    const parser = new Parser(del);

    parser.object(transformable);

    return internals.parse(transformable);
};

exports.stringify = function (input, del, sep, eql) {

    del = internals.assign(del, [sep, eql], '.');
    sep = internals.assign(sep, [del, eql], '&');
    eql = internals.assign(eql, [del, sep], '=');

    return Qs.stringify(internals.stringify(input, del), sep, eql);
};
