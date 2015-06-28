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

module.exports = function(obj_tiles) {

	console.log(obj_tiles);
	async.series([download_img, process], function() {
		console.log('fin')
	});

	function download_img(done) { //done=callback
		download(obj_tiles, done);
	}

	function process() {
		var tiles = obj_tiles.tiles;
		var folder = os.tmpDir();

		var vertical = []
		var horizontal = []
		_.each(tiles, function(tile, key) {
			vertical.push(tile[0]);
			horizontal.push(tile[1]);
		});

		for (var i = 0; i < vertical.length; i++) {
			var convert = 'convert -append ' + folder + vertical[i] + '-* ' + folder + vertical[i] + '.png';
			console.log(convert)
			exec(convert, function(err, stdout, stderr) {});
		};

		var convert_all = 'convert +append ' + folder + '*.png';
		convert.log(convert_all)
		exec(convert_all, function(err, stdout, stderr) {});


	}


}