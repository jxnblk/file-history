
var assert = require('assert');
var history = require('..');
var config = require('./config.json');

var opts = {
  repo: 'basscss/basscss',
  filepaths: [
    '/css/basscss.css',
    '/basscss.css',
  ],
  token: config.token
};

describe('file-history', function() {

  var results;

  it('should not throw', function(done) {
    assert.doesNotThrow(function() {
      history(opts, function(res) {
        results = res;
        done();
      });
    });
  });

  it('should be an array', function() {
    assert.equal(Array.isArray(results), true);
  });

  it('should have versions', function() {
    assert(results[0].version);
  });


});
