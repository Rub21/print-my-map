'use strict'
var os = require('os');
var request = require('request');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var serv = ['a', 'b', 'c'];
module.exports = function(obj_tiles, done) {
	var mapid = obj_tiles.mapid;
	var token = obj_tiles.token;
	var tiles = obj_tiles.tiles;
	var folder = os.tmpDir();

// 	function download(tile, key) {
// 		var baseName = tile[0] + '-' + tile[1] + '.png';
// 		var fileSrc = path.join(folder, baseName);
// 		var url = 'http://' + serv[let_random()] + '.tiles.mapbox.com/v4/' + mapid + '/' + tile[2] +
// 			'/' + tile[0] +
// 			'/' + tile[1] +
// 			'.png?access_token=' + token;
// 		var out = request({
// 			uri: url
// 		});
// 		out.on('response', function(resp) {
// 			if (resp.statusCode === 200) {
// 				var localStream = fs.createWriteStream(fileSrc);
// 				out.pipe(localStream);
// 				localStream.on('close', function() {
// 					console.log(index)
// 					index++;
// 					download(tiles[index],index);
// 					if (index === tiles.length - 1) {
// 						done(true)
// 					}
// 				});
// 			}
// 		});
// 	}

// var index = 0;
// download(tiles[index],index);

	//console.log(tiles)

	_.each(tiles, function(tile, key) {
		var baseName = tile[0] + '-' + tile[1] + '.png';
		var fileSrc = path.join(folder, baseName);
		var url = 'http://' + serv[let_random()] + '.tiles.mapbox.com/v4/' + mapid + '/' + tile[2] +
			'/' + tile[0] +
			'/' + tile[1] +
			'.png?access_token=' + token;
		var out = request({
			uri: url
		});
		out.on('response', function(resp) {
			if (resp.statusCode === 200) {
				var localStream = fs.createWriteStream(fileSrc);
				out.pipe(localStream);
				localStream.on('close', function() {
					if (key === tiles.length - 1) {
						done(true)
					}
				});
			}
		});
	});
}


function let_random() {
	var minimum = 0;
	var maximum = 2;
	return Math.round(Math.random() * (maximum - minimum) + minimum);
}