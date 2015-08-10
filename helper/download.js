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
	var value = [];//sirve para agregar los tiles qeu se cargaron, cunaod el ultimo cargo enviara un callback
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
					value.push(localStream);
					if (value.length === tiles.length) {
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