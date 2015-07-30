var Canvas = require('canvas'),
  Image = Canvas.Image,
  fs = require('fs');

var img = new Image,
  start = new Date;

var width = 100;
var height = 100;
var canvas = new Canvas(width, height);
var ctx = canvas.getContext('2d');




fs.readFile(__dirname +'/test.png', function(err, squid){
  if (err) throw err;

  img = new Image;
  img.src ='./test.png';
  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
});