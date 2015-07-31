'use strict'

var path = require('path');
var course = require('course');
var st = require('st');
var fs = require('fs');
var tilebelt = require('tilebelt');
var tilecover = require('tile-cover');
var geojsonArea = require('geojson-area');
var t = require('turf');
var _ = require('underscore');
var jsonbody = require('body/json');


var measure = require('../helper/measures')

var router = course();
var mount = st({
	path: path.join(__dirname, '..', 'public'),
	index: 'index.html',
	passthrough: true
});

router.post('/process', function(req, res) {
	jsonbody(req, res, function(err, body) {
		if (err) return fail(err, res);
		var json = body.json;
		var zoom = json.properties.zoom;
		var limits = {
			min_zoom: zoom,
			max_zoom: zoom
		}

		var tiles = tilecover.tiles(json.geometry, limits);
		var json_tiles = tilecover.geojson(json.geometry, limits);

		var obj_tiles = {
			mapid: json.properties.mapid,
			token: json.properties.token,
			tiles: tiles
		}

		var height_width_geo = measure(json);
		var geojson_tiles = t.bboxPolygon(t.extent(json_tiles));
		var height_width_geo_tiles = measure(geojson_tiles).reverse();


		//para las dimenciones que hace falta cortar

		var p1 = t.point(json.geometry.coordinates[0][0]);
		var p2 = t.point(geojson_tiles.geometry.coordinates[0][0])
		var input = {
			"type": "FeatureCollection",
			"features": []
		}
		input.features.push(p1);
		input.features.push(p2);
		var bbox = t.extent(input);
		var height_width_nim_poly = measure(t.bboxPolygon(bbox));

		fs.appendFile('json_tiles.js', JSON.stringify(t.bboxPolygon(bbox)));
		
		console.log(height_width_geo)
		console.log(height_width_geo_tiles)
		console.log(height_width_nim_poly)

		helper.converttiles(obj_tiles, height_width_geo, height_width_geo_tiles, height_width_nim_poly);
	});


});

function onRequest(req, res) {
	mount(req, res, function(err) {
		if (err) return fail(err, res);

		router(req, res, function(err) {
			if (err) return fail(err, res);

			res.statusCode = 404;
			res.end('404 Not Found:' + req.url);
		});
	});

}

function fail(err, res) {
	res.statusCode = 500;
	res.setHeader('Content-Type', 'text/plain');
	res.end(err.message);
}


module.exports = onRequest