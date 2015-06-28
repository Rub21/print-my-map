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

module.exports = function(obj_tiles) {

	console.log(obj_tiles);
	async.series([download_img, process], function() {
		console.log('fin')
	});

	function download_img(done) { //done=callback
		download(obj_tiles, done);
	}

	function process(flag) {

		setTimeout(function() {
			var tiles = obj_tiles.tiles;
			var folder = os.tmpDir();

			_.each(tiles, function(tile, key) {
				var baseName = key + '.png';
				var fileSrc = path.join(folder, baseName);
				gm(fileSrc).append(fileSrc, true)

			});

			done;
		}, 4000);

	}


}