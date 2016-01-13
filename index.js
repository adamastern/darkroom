var Darkroom = function(){

};

var darkroom = module.exports = new Darkroom();

Darkroom.prototype.init = require('./lib/core/init');
Darkroom.prototype.createApp = require('./lib/core/createApp');
Darkroom.prototype.start = require('./lib/core/start');

