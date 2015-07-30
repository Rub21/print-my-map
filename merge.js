var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

var vertical = [2342, 2343, 2344]
var horizontal = [3134, 3135]

for (var i = 0; i < vertical.length; i++) {

	for (var j = 0; j < horizontal.length; j++) {

		var img =vertical[i] + "-" + horizontal[j] + ".png";
		console.log(img)
		if (i === 0 && j === 0) {
			gm('er.png').append(img).append(true)
		} else {
			gm(img).append(img).append(true)
		}
	};
};

gm("er.png").append("2342-3134.png",true)