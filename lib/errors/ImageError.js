function ImageError(message) {
	this.name = 'ImageError';
	this.message = message;
	this.stack = (new Error()).stack;
}

ImageError.prototype = new Error;

module.exports = ImageError;