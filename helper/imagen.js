var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require('async');
var dataURIBuffer = require('data-uri-to-buffer');
var uuid = require('uuid'); //para dar una identificacion unica a los archivos
var EventEmitter = require('events').EventEmitter;
var download = require('./download');
var concat = require('concat-stream');
var gm = require('gm');
var exec = require('child_process').exec;
var _ = require('underscore');

module.exports = function(obj_tiles) {

	console.log(obj_tiles);
	// async.series([download_img, process], function() {
	// 	console.log('fin')
	// });

	function download_img() { //done=callback
		download(obj_tiles, process);
	}

	function process(flag) {
		console.log(flag)
		console.log("5555555555555555555555555555555")
		var tiles = obj_tiles.tiles;
		var folder = os.tmpDir();

		var vertical = []
		var horizontal = []
		_.each(tiles, function(tile, key) {
			vertical.push(tile[0]);
			horizontal.push(tile[1]);
		});

		vertical = _.uniq(vertical)
		horizontal = _.uniq(horizontal)
		setTimeout(function() {
			for (var i = 0; i < vertical.length; i++) {
				var dir = folder + '/' + vertical[i];
				var convert = 'convert -append ' + dir + '-* ' + dir + '.png && rm ' + dir + '-*';
				console.log(convert)
				exec(convert, function(err, stdout, stderr) {});
			};

			setTimeout(function() {
				var convert_all = 'convert +append ' + folder + '/*.png ' + folder + '/result.png'
				console.log(convert_all)
				exec(convert_all, function(err, stdout, stderr) {});
			}, 500);

		}, 2000);

	}

	download_img();


}