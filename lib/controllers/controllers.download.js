var imageService = new(require('../services/services.image'))();
var _ = require('lodash');

function DownloadController(){

}

DownloadController.prototype.getImage = function(req, res, next){

	res.set('Content-Type', 'text/plain');

	var imageName = req.params.imageName;

	var width = req.query['w'];
	var height = req.query['h'];
	var mode = req.query['mode'];
	var gravity = req.query['gravity'];
	var blur = req.query['blur'];

	var validExtension = [
		'png',
		'jpg',
		'jpeg'
	];

	var extension = imageName.substr(imageName.lastIndexOf('.') + 1);

	if(!extension || validExtension.indexOf(extension) < 0){
		res.status(403);
		res.send();
		return;
	}

	var imgStream = imageService.getImage(imageName,{
		width:width,
		height:height,
		mode:mode,
		gravity:gravity,
		blur:blur
	});

	imgStream.on('error', function(err) {
		res.status(500);
		res.send();
	});

	res.set('Cache-Control', 'public, max-age=31516522');
	res.set('Content-Type', 'image/' + extension);
	imgStream.pipe(res);

};

module.exports = DownloadController;