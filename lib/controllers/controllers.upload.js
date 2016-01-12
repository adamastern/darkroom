var _ = require('lodash');
var imageService = new(require('../services/services.image'))();

function UploadController(){

}

UploadController.prototype.upload = function(req, res, next){
	var file = req.file;

	if(!_.isPlainObject(file) || !_.has(file,'path') || !_.isString(file.path)){



	}

	var path = file.path;

	imageService.processImage(path, {}, function(err){
		res.json();
	});


};

module.exports = UploadController;