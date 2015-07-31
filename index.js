var t = require('turf');
var tilecover = require('tile-cover');
var _ = require('underscore');
var help = require('./helper/measures');

var record = document.querySelector('#butto_imagen');
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var serv = ['a', 'b', 'c'];

record.addEventListener('click', function(e) {
	e.preventDefault();
	var poly = JSON.parse(document.querySelector('#coordinates').textContent);
	var zoom = poly.properties.zoom;
	var limits = {
		min_zoom: zoom,
		max_zoom: zoom
	}
	var tiles = tilecover.tiles(poly.geometry, limits);
	var p_tiles = tilecover.geojson(poly.geometry, limits);
	var p_index = tilecover.indexes(poly.geometry, limits);
	con(p_index)
	var poly_tiles = t.bboxPolygon(t.extent(p_tiles));

	var size_tiles = help.wh(poly_tiles).reverse();
	var size_poly = help.wh(poly);

	//para las dimenciones que hace falta cortar
	var p1 = t.point(poly.geometry.coordinates[0][0]);
	var p2 = t.point(poly_tiles.geometry.coordinates[0][0])
	var input = {
		"type": "FeatureCollection",
		"features": []
	}
	input.features.push(p1);
	input.features.push(p2);
	var bbox = t.extent(input);
	var size_nim_poly = help.wh(t.bboxPolygon(bbox));

	//IMAGEN
	var vertical = []
	var horizontal = []
	_.each(tiles, function(tile, key) {
		vertical.push(tile[1]);
		horizontal.push(tile[0]);
	});
	vertical = _.uniq(vertical);
	horizontal = _.uniq(horizontal);


	//setTimeout(function() {
	canvas.width = 256 * horizontal.length;
	canvas.height = 256 * vertical.length;
	con(canvas.width + '-X-' + canvas.height);

	// var wh_tiles = [];
	// wh_tiles.push(canvas.width);
	// wh_tiles.push(canvas.height);

	// var wh_poly = [];
	// wh_poly.push(canvas.width / size_tiles[0] * size_poly[0]);
	// wh_poly.push(canvas.height / size_tiles[1] * size_poly[1]);

	// var wh_nim_poly = [];
	// wh_nim_poly.push(canvas.width / size_tiles[0] * size_nim_poly[0]);
	// wh_nim_poly.push(canvas.height / size_tiles[1] * size_nim_poly[1]);

	// con(size_tiles)
	// con(wh_tiles.join('X'));
	// con(size_poly)
	// con(wh_poly.join('X'));
	// con(size_nim_poly)
	// con(wh_nim_poly.join('X'));

	for (var i = 0; i < vertical.length; i++) {
		for (var j = 0; j < horizontal.length; j++) {
			var url = 'http://' + serv[ale()] + '.tiles.mapbox.com/v4/' + poly.properties.mapid + '/' + zoom + '/' + horizontal[j] + '/' + vertical[i] + '.png?access_token=' + poly.properties.token;
			con(url)
			var x = 256 * j;
			var y = 256 * i;
			loadImage(url, x, y);
		};
	};
	//}, 100);
}, false);

function logError(err) {
	console.error(err);
}

function con(s) {
	console.log(s);
}

function loadImage(url, x, y) {
	var image = new Image();
	image.src = url;
	image.onload = function() {
		ctx.drawImage(image, x, y);
	};
}

function ale() {
	minimum = 0;
	maximum = 2;
	return Math.round(Math.random() * (maximum - minimum) + minimum);
}