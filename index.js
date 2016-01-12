var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var corsMiddleware = require('./helpers/cors');

var app = express();

app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(routes);

var port = config.get('express.port');
app.listen(port, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('App listening on port', port);
	}
});