var easyimg = require('easyimage');


var info = easyimg.info('./result.png').then(
	function(image) {
		console.log(+image.width + ' x ' + image.height);
	},
	function(err) {
		console.log(err);
	});



easyimg.rescrop({
	src: 'result.png',
	dst: 'thumbnail2.jpg',
	width: 512,
	height: 1024,
	cropwidth: 389,
	cropheight: 598,
	gravity: 'North',
	x: 40,
	y: 253
}).then(
	function(image) {
		console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
	},
	function(err) {
		console.log(err);
	}
);

// 512 x 1024
// 388.98237095692286 x 598.0014060823784
// 39.99818724551762 x 252.99426694502588