module.exports = function(){

	this.createApp();

	var port = this.options.get('app.port');

	this.app.listen(port, function(err){
		if(err){
			console.log(err)
		}else{
			console.log('Darkroom started. Listening on port', port);
		}
	});
};