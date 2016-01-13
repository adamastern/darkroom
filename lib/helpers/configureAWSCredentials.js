var AWS = require('aws-sdk');
var _ = require('lodash');

module.exports = function(AWSInstance, config){
	if(_.has(config,'sharedIni')){
		var profile = config.sharedIni.profile;
		AWSInstance.config.credentials = new AWS.SharedIniFileCredentials({
			profile: profile
		});
	}
};