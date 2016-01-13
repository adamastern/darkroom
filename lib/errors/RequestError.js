function RequestError(message) {
	this.name = 'RequestError';
	this.message = message;
	this.code = 400;
	this.stack = (new Error()).stack;
}

RequestError.prototype = new Error;

module.exports = RequestError;