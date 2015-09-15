'use strict';

var Qs = require('querystring');

var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();

var Nvpqs = require('../');

var NVPStub = require('./stubs/nvp.json');
var ObjectStub = require('./stubs/object.json');

lab.experiment('NVP encoded querystring utility belt', function () {

    lab.experiment('parses a querystring to proper JavaScript object and', function () {

        lab.test('returns empty object when the querystring is blank', function (done) {

            var input = '';
            var output = Nvpqs.parse(input);

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns matching object when the querystring is not blank and valid', function (done) {

            var output = Nvpqs.parse(Qs.stringify(NVPStub));

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.deep.equal(ObjectStub);

            return done();
        });
    });

    lab.experiment('stringifies a JavaScript object to a proper querystring and', function () {

        lab.test('returns a blank querystring if the object is empty or null', function (done) {

            var input = {};
            var output = Nvpqs.stringify(input);

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns a matching querystring if the object is not empty nor null', function (done) {

            var output = Nvpqs.stringify(ObjectStub);

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });
    });

    lab.experiment('allows custom notitation delimiter and separator characters', function () {

        lab.test('returns a matching querystring using a custom delimiter character', function (done) {

            var output = Nvpqs.stringify(ObjectStub, '-');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\./g, '-'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid delimiter', function (done) {

            var output = Nvpqs.stringify(ObjectStub, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring using a custom separator character', function (done) {

            var output = Nvpqs.stringify(ObjectStub, null, '+');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\&/g, '+'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid separator', function (done) {

            var output = Nvpqs.stringify(ObjectStub, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring using a custom assignment character', function (done) {

            var output = Nvpqs.stringify(ObjectStub, null, null, ':');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\=/g, ':'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid assignment character', function (done) {

            var output = Nvpqs.stringify(ObjectStub, null, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring with default options for similiar custom characters', function (done) {

            var output = Nvpqs.stringify(ObjectStub, '.', '.', '.');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });
    });
});
