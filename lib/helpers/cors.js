var config = require('config');
var cors = require('cors');

module.exports = function(req,res,next){

	var whitelist = config.get('access.origins');

	var corsOptions = {
		origin: function(origin, callback){
			var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
			callback(null, originIsWhitelisted);
		}
	};

	return cors(corsOptions)(req,res,next);

};