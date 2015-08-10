var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require('async');
var dataURIBuffer = require('data-uri-to-buffer');
var uuid = require('uuid'); //para dar una identificacion unica a los archivos
var EventEmitter = require('events').EventEmitter;
var download = require('./download');
//var concat = require('concat-stream');
//var gm = require('gm');
var exec = require('child_process').exec;
var _ = require('underscore');
var easyimg = require('easyimage');

var folder = os.tmpDir();
//var folder = os.tmpDir();
module.exports = function(res, obj_tiles, hw_geojson, hw_tiles, hw_diff) {


	function download_img() { //done=callback
		download(obj_tiles, process);
	}

	function process(flag) {
		console.log(flag)
		if (flag) {
			var tiles = obj_tiles.tiles;
			var vertical = []
			var horizontal = []
			_.each(tiles, function(tile, key) {
				vertical.push(tile[0]);
				horizontal.push(tile[1]);
			});
			vertical = _.uniq(vertical);
			horizontal = _.uniq(horizontal);
			var query = '';
			var rm_img = 'rm '
			var query_vertical = 'convert +append '
			for (var i = 0; i < vertical.length; i++) {
				var query_horizontal = 'convert -append ';
				var img_out = folder + '/' + vertical[i] + ".png";

				for (var j = 0; j < horizontal.length; j++) {

					var img = folder + '/' + vertical[i] + "-" + horizontal[j] + ".png ";
					rm_img = rm_img + ' ' + img;
					query_horizontal = query_horizontal + img

				};

				rm_img = rm_img + ' ' + img_out;

				query_horizontal = query_horizontal + ' ' + img_out;

				if (i === 0) {
					query = query + query_horizontal;
				}
				query = query + ' && ' + query_horizontal;

				query_vertical = query_vertical + img_out + ' ';
			};
			query_vertical = query_vertical + ' ' + folder + '/' + 'result.png'
			var convert = query + ' && ' + query_vertical + ' && ' + rm_img;
			console.log(tiles.length)
			setTimeout(function() {
				exec(convert, function(err, stdout, stderr) {
					var info = easyimg.info(folder + '/result.png').then(
						function(image) {

							var w_geojson = image.width / hw_tiles[1] * hw_geojson[1];
							var h_geojson = image.height / hw_tiles[0] * hw_geojson[0];

							var w_diff = image.width / hw_tiles[1] * hw_diff[1];
							var h_diff = image.height / hw_tiles[0] * hw_diff[0];

							easyimg.rescrop({
								src: folder + '/result.png',
								dst: folder + '/result-crop.png',
								width: image.width,
								height: image.height,
								cropwidth: w_geojson,
								cropheight: h_geojson,
								gravity: 'NorthWest',
								x: w_diff,
								y: h_diff
							}).then(
								function(image) {
									fs.readFile(folder + '/result-crop.png', function(err, data) {
										var base64data = new Buffer(data).toString('base64');
										res.end(base64data);
									});
								},
								function(err) {
									console.log(err);
								}
							);
						},
						function(err) {
							console.log(err);
						});
				});
			}, 500)

		}
	}
	download_img();
}