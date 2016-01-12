var sharp = require('sharp');
var uuid = require('uuid');
var AWS = require('aws-sdk');
var config = require('config');
var ImageError = require('../errors/ImageError');
var credentials = new AWS.SharedIniFileCredentials({profile: 'dragonfruit'});
AWS.config.credentials = credentials;

var region = config.get('images.s3.region');
var bucket = config.get('images.s3.bucket');

var s3Client = new AWS.S3({
	region: region
});

function ImageService(){

}

ImageService.prototype.processImage = function(path, opts, cb){
	var self = this;

	var imageId = uuid.v4();
	var image = sharp(path);

	image.metadata(function(err, metadata){
		if(err){
			cb(new ImageError(err.message));
		}else{
			var filename = imageId + '.' + metadata.format;
			var contentType = 'image/' + metadata.format;
			self._uploadImage(image, filename, contentType, function(err){
				if(err){
					cb(new ImageError(err.message));
				}else{
					cb(null, {
						imageId:imageId,
						format:metadata.format
					});
				}
			});
		}
	})
};

ImageService.prototype._uploadImage = function(image, filename, contentType, cb){
	s3Client.upload({
		Body:image,
		Key:filename,
		Bucket:bucket,
		ACL:'public-read',
		ContentType:contentType
	}, function(err,data){
		if(err){
			cb(err);
		}else{
			cb();
		}
	});
};

module.exports = ImageService;