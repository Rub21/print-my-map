'use strict'

var path = require('path');
var course = require('course');
var st = require('st');
var tilebelt = require('tilebelt');
var tilecover = require('tile-cover');

var _ = require('underscore');
var jsonbody = require('body/json');
var helper = require('../helper');


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
		helper.converttiles(obj_tiles);
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


function long2tile(lon, zoom) {
	return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

function lat2tile(lat, zoom) {
	return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}


function polygonArea(geom) {

	geom = geom.coordinates[0];
	var numPoints = geom.length
	console.log(geom)
	var X = [];
	var Y = [];
	for (var i = 0; i < geom.length; i++) {
		X.push(geom[i][0])
		Y.push(geom[i][1])

	};
	var area = 0;
	var j = numPoints - 1;
	for (i = 0; i < numPoints; i++) {
		area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
		j = i;
	}
	return area / 2;
}

module.exports = onRequest