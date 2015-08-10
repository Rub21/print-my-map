var xhr = require('xhr');
var record = document.querySelector('#butto_imagen');

record.addEventListener('click', function(e) {
	e.preventDefault();
	var json = JSON.parse(document.querySelector('#coordinates').textContent);
	addclass(" loading");
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
		removeclass(" loading");
		document.querySelector('#download_imagen').href = "data:image/png;base64," + body;
		document.querySelector('#download_imagen').click();
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


function addclass(myclass) {
	var d;
	d = document.getElementById('map');
	d.className = d.className.replace(myclass, "");
	d.className = d.className + myclass;
}

function removeclass(myclass) {
	var d;
	d = document.getElementById('map');
	d.className = d.className.replace(myclass, "");
}