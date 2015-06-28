var xhr = require('xhr');
var record = document.querySelector('#butto_imagen');

record.addEventListener('click', function(e) {
	e.preventDefault();
	var json = JSON.parse(document.querySelector('#coordinates').textContent);

	xhr({
		uri: '/process',
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			json: json
		})
	}, function(err, res, body) {
		if (err) return logError(err)

		body = JSON.parse(body)
		console.log(body)


	});
}, false);

function logError(err) {
	console.error(err);
}

function long2tile(lon, zoom) {
	return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

function lat2tile(lat, zoom) {
	return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}