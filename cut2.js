var easyimg = require('easyimage');


var info = easyimg.info('./test.png').then(
	function(image) {
		console.log(+image.width + ' x ' + image.height);
	},
	function(err) {
		console.log(err);
	});



easyimg.rescrop({
	src: 'test.png',
	dst: './output/thumbnail.jpg',
	width: 500,
	height: 500,
	cropwidth: 128,
	cropheight: 128,
	x: 50,
	y: 23
}).then(
	function(image) {
		console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
	},
	function(err) {
		console.log(err);
	}
);