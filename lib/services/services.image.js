var sharp = require('sharp');
var uuid = require('uuid');
var AWS = require('aws-sdk');
var ImageError = require('../errors/ImageError');
var darkroom = require('../../');
var configureAWSCredentials = require('../helpers/configureAWSCredentials');

var awsAuthentication = darkroom.options.get('images.s3.credentials');
var region = darkroom.options.get('images.s3.region');
var bucket = darkroom.options.get('images.s3.bucket');
var s3Client = new AWS.S3({
	region: region
});

configureAWSCredentials(s3Client, awsAuthentication);

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
						format:metadata.format,
						filename:filename
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