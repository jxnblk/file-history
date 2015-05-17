
var _ = require('lodash');
var request = require('superagent');
var semverCompare = require('semver-compare');

module.exports = function(opts, callback) {

  var opts = opts || {};
  var api = 'https://api.github.com/repos/'
  var history = [];
  var tags = [];
  var length = 0;

  if (!opts.token) {
    console.log('No GitHub access token provided.'); 
  }
  if (!opts.repo) {
    console.log('No GitHub repo provided.'); 
  }

  opts = _.defaults(opts, {
    filepaths: ['/README.md'],
    history: [],
    per_page: 100,
  });

  function getTags() {
    var url = api + opts.repo + '/tags';
    request
      .get(url)
      .query({
        access_token: opts.token,
        per_page: opts.per_page
      })
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return false;
        }
        tags = JSON.parse(res.text);
        length = tags.length;
        tags.forEach(getContents);
      });
      //.on('progress', function(e) {
      //  console.log('Getting tags... ', e.percent);
      //});
  }

  function getFile(tag) {
    var i;
    var cb;
    if (typeof arguments[1] === 'number') {
      i = arguments[1];
      cb = arguments[2];
    } else if (typeof arguments[1] === 'function') {
      i = 0;
      cb = arguments[1];
    }
    var url = api + opts.repo + '/contents' + opts.filepaths[i];

    request
      .get(url)
      .query({ ref: tag.commit.sha, access_token: opts.token })
      .end(function(err, res) {
        if (err) {
          i++;
          getFile(tag, i, cb);
          return false;
        } else {
          cb(err, res, i);
        }
      });
      //.on('progress', function(e) {
      //  console.log('Getting file for ' + tag.name + '... ', e.percent);
      //});
  }

  function getContents(tag) {
    var index = _.findIndex(opts.history, function(item) { return item.version === tag.name.replace(/^v/, '') });
    if (index > -1) {
      var item = opts.history[index];
      console.log('Found record for ' + item.version + ' in opts.history');
      history.push(item);
      if (history.length >= length) {
        done();
      }
    } else {
      getFile(tag, function(err, res, i) {
        if (err) {
          console.log('getFile error', i);
          history.push({ version: tag.name.replace(/^v/, '') });
          return false;
        } else {
          var obj = JSON.parse(res.text);
          var buffer = new Buffer(obj.content, 'base64')
          var content = buffer.toString();
          history.push({
            version: tag.name.replace(/^v/, ''),
            filepath: opts.filepaths[i],
            content: content 
          });
        }
        if (history.length >= length) {
          done();
        }
      });
    }
  }

  function done() {
    history = history.sort(function(a, b) {
      return semverCompare(a.version, b.version);
    })
    if (typeof callback === 'function') {
      callback(history);
    }
  }

  getTags();

};

