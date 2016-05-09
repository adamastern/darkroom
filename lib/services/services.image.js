var sharp = require('sharp');
var uuid = require('uuid');
var _ = require('lodash');
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
			var width = metadata.width;
			var height = metadata.height;
			var filename = imageId + '.' + metadata.format;
			var contentType = 'image/' + metadata.format;
			self._uploadImage(image, filename, contentType, function(err){
				if(err){
					cb(new ImageError(err.message));
				}else{
					cb(null, {
						imageId:imageId,
						format:metadata.format,
						filename:filename,
						width:width,
						height:height
					});
				}
			});
		}
	})
};

ImageService.prototype.getImage = function(filename, opts){

	var width = opts.width;
	var height = opts.height;
	var mode = opts.mode;
	var gravity = opts.gravity;
	var blur = opts.blur;

	//download the image
	var params = {
		Bucket: bucket,
		Key: filename
	};

	var downloadStream = s3Client.getObject(params)
		.createReadStream();

	//construct img pipeline
	var imagePipeline = sharp();

	if(width && height){
		width = parseInt(width);
		height = parseInt(height);
		imagePipeline.resize(width, height);

		if(!mode || mode === 'fill'){
			imagePipeline.crop(this._gravityFromString(gravity));
		}else if(mode === 'embed'){
			imagePipeline.embed()
				.background({r: 255, g: 255, b: 255});
		}else if(mode === 'fit'){
			imagePipeline.max();
		}else if(mode === 'limit'){
			imagePipeline.max().withoutEnlargement();
		}else if(mode === 'min'){
			imagePipeline.min();
		}
	}

	if(blur){
		var blurAmount = 36;
		if(!_.isNaN(blur)){
			blur = parseInt(blur);
			if(blur > 1 && blur < 200){
				blurAmount = blur;
			}
		}
		imagePipeline.blur(blurAmount);
	}

	downloadStream.pipe(imagePipeline);
	return imagePipeline;

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

ImageService.prototype._gravityFromString = function(gravityStr){

	if(gravityStr === 'n'){
		return sharp.gravity.north;
	}else if(gravityStr === 'ne'){
		return sharp.gravity.northeast;
	}else if(gravityStr === 'e'){
		return sharp.gravity.east;
	}else if(gravityStr === 'se'){
		return sharp.gravity.southeast;
	}else if(gravityStr === 's'){
		return sharp.gravity.south;
	}else if(gravityStr === 'sw'){
		return sharp.gravity.southwest;
	}else if(gravityStr === 'w'){
		return sharp.gravity.west;
	}else if(gravityStr === 'nw'){
		return sharp.gravity.northwest;
	}

	return sharp.gravity.center;

};

module.exports = ImageService;