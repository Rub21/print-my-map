var t = require('turf');

module.exports = function(poly) {
	var hw = []; //[height, width]
	for (var i = 0; i < poly.geometry.coordinates[0].length - 3; i++) {
		var point1 = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": poly.geometry.coordinates[0][i]
			}
		};
		var point2 = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": poly.geometry.coordinates[0][i + 1]
			}
		};
		hw.push(t.distance(point1, point2, 'kilometers'));

	};

	return hw;
}