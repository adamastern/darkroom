module.exports = function(){

	var express = require('express');
	var bodyParser = require('body-parser');
	var routes = require('../routes');
	var corsMiddleware = require('../helpers/cors');

	var app = express();
	app.use(bodyParser.json());
	app.use(corsMiddleware);
	app.use(routes);

	this.app = app;
};