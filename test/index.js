'use strict';

var qs = require('querystring');

var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();

var nvpqs = require('../');

var nvp_stub = require('./stubs/nvp.json');
var object_stub = require('./stubs/object.json');

lab.experiment('NVP encoded querystring utility belt', function () {

    lab.experiment('parses a querystring to proper JavaScript object and', function () {

        lab.test('returns empty object when the querystring is blank', function (done) {

            var input = '';
            var output = nvpqs.parse(input);

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns matching object when the querystring is not blank and valid', function (done) {

            var output = nvpqs.parse(qs.stringify(nvp_stub));

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.deep.equal(object_stub);

            return done();
        });
    });

    lab.experiment('stringifies a JavaScript object to a proper querystring and', function () {

        lab.test('returns a blank querystring if the object is empty or null', function (done) {

            var input = {};
            var output = nvpqs.stringify(input);

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns a matching querystring if the object is not empty nor null', function (done) {

            var output = nvpqs.stringify(object_stub);

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub));

            return done();
        });
    });

    lab.experiment('allows custom notitation delimiter and separator characters', function () {

        lab.test('returns a matching querystring using a custom delimiter character', function (done) {

            var output = nvpqs.stringify(object_stub, '-');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub).replace(/\./g, '-'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid delimiter', function (done) {

            var output = nvpqs.stringify(object_stub, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub));

            return done();
        });

        lab.test('returns a matching querystring using a custom separator character', function (done) {

            var output = nvpqs.stringify(object_stub, null, '+');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub).replace(/\&/g, '+'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid separator', function (done) {

            var output = nvpqs.stringify(object_stub, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub));

            return done();
        });

        lab.test('returns a matching querystring using a custom assignment character', function (done) {

            var output = nvpqs.stringify(object_stub, null, null, ':');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub).replace(/\=/g, ':'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid assignment character', function (done) {

            var output = nvpqs.stringify(object_stub, null, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub));

            return done();
        });

        lab.test('returns a matching querystring with default options for similiar custom characters', function (done) {

            var output = nvpqs.stringify(object_stub, '.', '.', '.');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(qs.stringify(nvp_stub));

            return done();
        });
    });
});
