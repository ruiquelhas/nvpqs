'use strict';

const Qs = require('querystring');

const Lab = require('lab');
const Code = require('code');

const lab = exports.lab = Lab.script();

const Nvpqs = require('../');

const NVPStub = require('./stubs/nvp.json');
const ObjectStub = require('./stubs/object.json');

lab.experiment('NVP encoded querystring utility belt', () => {

    lab.experiment('parses a querystring to proper JavaScript object and', () => {

        lab.test('returns empty object when the querystring is blank', (done) => {

            const output = Nvpqs.parse('');

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns matching object when the querystring is not blank and valid', (done) => {

            const output = Nvpqs.parse(Qs.stringify(NVPStub));

            Code.expect(output).to.be.an.object();
            Code.expect(output).to.deep.equal(ObjectStub);

            return done();
        });
    });

    lab.experiment('stringifies a JavaScript object to a proper querystring and', () => {

        lab.test('returns a blank querystring if the object is empty or null', (done) => {

            const output = Nvpqs.stringify({});

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.be.empty();

            return done();
        });

        lab.test('returns a matching querystring if the object is not empty nor null', (done) => {

            const output = Nvpqs.stringify(ObjectStub);

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });
    });

    lab.experiment('allows custom notitation delimiter and separator characters', () => {

        lab.test('returns a matching querystring using a custom delimiter character', (done) => {

            const output = Nvpqs.stringify(ObjectStub, '-');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\./g, '-'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid delimiter', (done) => {

            const output = Nvpqs.stringify(ObjectStub, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring using a custom separator character', (done) => {

            const output = Nvpqs.stringify(ObjectStub, null, '+');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\&/g, '+'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid separator', (done) => {

            const output = Nvpqs.stringify(ObjectStub, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring using a custom assignment character', (done) => {

            const output = Nvpqs.stringify(ObjectStub, null, null, ':');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub).replace(/\=/g, ':'));

            return done();
        });

        lab.test('returns a matching querystring with default options for invalid assignment character', (done) => {

            const output = Nvpqs.stringify(ObjectStub, null, null, 'a');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });

        lab.test('returns a matching querystring with default options for similiar custom characters', (done) => {

            const output = Nvpqs.stringify(ObjectStub, '.', '.', '.');

            Code.expect(output).to.be.a.string();
            Code.expect(output).to.equal(Qs.stringify(NVPStub));

            return done();
        });
    });
});
