var _ = require('lodash');
var imageService = new(require('../services/services.image'))();
var RequestError = require('../errors/RequestError');
var darkroom = require('../../');

function UploadController(){

}

UploadController.prototype.upload = function(req, res, next){
	var file = req.file;

	if(!_.isPlainObject(file) || !_.has(file, 'path') || !_.isString(file.path)){
		res.apiError(new RequestError('Request does not contain a valid file.'));
		return;
	}

	var path = file.path;
	var preUploadReference = null;

	var attemptUpload = function(){
		imageService.processImage(path, {}, function(err, imgData){
			if(err){
				res.apiError(err);
			}else{
				imgData.preUploadReference = preUploadReference;
				var postUpload = darkroom.options.get('postUpload');
				if(postUpload && postUpload instanceof Function) {
					postUpload(imgData, function(err, response){
						if(err){
							res.apiError(err);
						}else{
							res.apiResponse(response);
						}
					})
				}else{
					res.apiResponse(imgData);
				}
			}
		});
	};

	var preUpload = darkroom.options.get('preUpload');
	if(preUpload && preUpload instanceof Function){
		preUpload(req, function(err, data){
			if(err){
				res.apiError(err);
			}else{
				preUploadReference = data;
				attemptUpload();
			}
		});
	}else{
		attemptUpload();
	}
};

module.exports = UploadController;