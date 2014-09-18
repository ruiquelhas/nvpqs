//jshint expr: true

var qs = require('querystring');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var nvpqs = require('../');

var nvp_stub = require('./stubs/nvp.json');
var object_stub = require('./stubs/object.json');

lab.experiment('NVP encoded querystring utility belt', function () {
  lab.experiment('parses a querystring to proper JavaScript object and', function () {
    lab.test('returns empty object when the querystring is blank', function (done) {
      var input = '', output = nvpqs.parse(input);
      Lab.expect(output).to.be.a('object');
      Lab.expect(output).to.be.empty;
      done();
    });

    lab.test('returns matching object when the querystring is not blank and valid', function (done) {
      var output = nvpqs.parse(qs.stringify(nvp_stub));

      Lab.expect(output).to.be.a('object');
      Lab.expect(output).to.deep.equal(object_stub);

      done();
    });
  });

  lab.experiment('stringifies a JavaScript object to a proper querystring and', function () {
    lab.test('returns a blank querystring if the object is empty or null', function (done) {
      var input = {}, output = nvpqs.stringify(input);
      Lab.expect(output).to.be.a('string');
      Lab.expect(output).to.be.empty;
      done();
    });

    lab.test('returns a matching querystring if the object is not empty nor null', function (done) {
      var output = nvpqs.stringify(object_stub);

      Lab.expect(output).to.be.a('string');
      Lab.expect(output).to.equal(qs.stringify(nvp_stub));

      done();
    });

    lab.test('returns a matching querystring using a custom delimiter', function (done) {
      var output = nvpqs.stringify(object_stub, '-');

      Lab.expect(output).to.be.a('string');
      Lab.expect(output).to.equal(qs.stringify(nvp_stub).replace(/\./g, '-'));

      done();
    });
  });
});
