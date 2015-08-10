'use strict'

var path = require('path');
var course = require('course');
var st = require('st');
var fs = require('fs');
//var jsts = require("jsts");
var tilebelt = require('tilebelt');
var tilecover = require('tile-cover');
var geojsonArea = require('geojson-area');
//var distance = require('turf-distance');


var t = require('turf');


var _ = require('underscore');
var jsonbody = require('body/json');
var helper = require('../helper');
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
		var geojson = body.json;
		var zoom = geojson.properties.zoom;
		var limits = {
			min_zoom: zoom,
			max_zoom: zoom
		}
		var tiles = tilecover.tiles(geojson.geometry, limits); //num tiles in geojson
		var json_tiles = tilecover.geojson(geojson.geometry, limits); //geojson from each tile in geojson

		var obj_tiles = {
			mapid: geojson.properties.mapid,
			token: geojson.properties.token,
			tiles: tiles
		}

		var hw_geojson = measure(geojson); //altura y ancho del geojson
		var geojson_tiles = t.bboxPolygon(t.extent(json_tiles));
		var hw_tiles = measure(geojson_tiles).reverse(); //altura y ancho de los tiles

		//para las dimenciones que hace falta cortar
		// fs.writeFile('geojson.js', JSON.stringify(geojson));
		// fs.writeFile('geojson_tiles.js', JSON.stringify(geojson_tiles));

		var p1 = t.point(geojson.geometry.coordinates[0][1]);
		var p2 = t.point(geojson_tiles.geometry.coordinates[0][3])
		var input = {
			"type": "FeatureCollection",
			"features": []
		}
		input.features.push(p1);
		input.features.push(p2);
		var bbox = t.extent(input);
		var hw_diff = measure(t.bboxPolygon(bbox)).reverse();
		//fs.writeFile('diff.js', JSON.stringify(t.bboxPolygon(bbox)));
		//fs.appendFile('json_tiles.js', JSON.stringify(t.bboxPolygon(bbox)));
		// console.log('Size tiles ' + hw_tiles)
		// console.log('Size geojson ' + hw_geojson)
		// console.log('Size diff ' + hw_diff)
		helper.converttiles(res, obj_tiles, hw_geojson, hw_tiles, hw_diff);
		// res.end(JSON.stringify({
		// 	imgen: 'img'
		// }));
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