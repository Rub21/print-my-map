'use strict'

var fs = require('fs');

module.exports = function (folder, filter, callback) {

  fs.readdir(folder, onReaddir);

  function onReaddir (err, results) {
    if (err) return callback(err);

    var files = results.filter(filterFiles);

    callback(null, files);
  }

  function filterFiles (file) {
    return file.startsWith(filter);
  }

}
