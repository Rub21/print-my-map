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
module.exports = function(obj_tiles, height_width_geo, height_width_geo_tiles, height_width_nim_poly) {


	function download_img() { //done=callback
		download(obj_tiles, process);
	}

	function process(flag) {
		console.log(flag)

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

		//console.log(convert)
		exec(convert, function(err, stdout, stderr) {
			var info = easyimg.info(folder + '/result.png').then(
				function(image) {

					var image_width = image.width / height_width_geo_tiles[1] * height_width_geo[1];
					var image_height = image.height / height_width_geo_tiles[0] * height_width_geo[0];

					var image_width_crop = image.width * height_width_nim_poly[1] / height_width_geo_tiles[1];
					var image_height_crop = image.height * height_width_nim_poly[0] / height_width_geo_tiles[0];



					console.log(image.width + ' x ' + image.height);
					console.log(image_width + ' x ' + image_height);
					console.log(image_width_crop + ' x ' + image_height_crop);
					easyimg.rescrop({
						src: folder + '/result.png',
						dst: folder + '/result-crop.png',
						width: image.width,
						height: image.height,
						cropwidth: image_width,
						cropheight: image_height,
						x: image_width_crop,
						y: image_height_crop
					}).then(
						function(image) {
							console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
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



	}

	download_img();


}