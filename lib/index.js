'use strict';

const Qs = require('querystring');

const _ = {
    isObject: require('lodash.isobject'),
    reduce: require('lodash.reduce'),
    some: require('lodash.some'),
    transform: require('lodash.transform')
};

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

    return _.reduce(array, (result, value) => {

        if (_.isObject(value)) {
            result.push(internals.parse(value));
        }
        else {
            result.push(value);
        }

        return result;
    }, []);
};

internals.parse = function (obj) {

    return _.transform(obj, (result, value, key) => {

        const isArray = _.some(Object.keys(value), internals.isNumeric);

        if (_.isObject(value) && isArray) {
            result[key] = internals.transform(value);
        }
        else if (_.isObject(value) && !isArray) {
            result[key] = internals.parse(value);
        }
        else {
            result[key] = value;
        }
    });
};

internals.stringify = function (obj, del, current) {

    return _.transform(obj, (result, value, key) => {

        const builder = (current ? [current, key].join(del) : key);

        if (_.isObject(value)) {
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
