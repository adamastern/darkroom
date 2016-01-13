var cors = require('cors');
var darkroom = require('../../');
module.exports = function(req,res,next){

	var whitelist = darkroom.options.get('app.access.whitelist');

	var corsOptions = {
		origin: function(origin, callback){
			var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
			callback(null, originIsWhitelisted);
		}
	};

	return cors(corsOptions)(req,res,next);

};