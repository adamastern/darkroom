var _ = require('lodash');

module.exports = function(options){
	this._options = options;
	this.options = {
		get:function(keyPath){
			return _.get(options,keyPath);
		}
	}
};