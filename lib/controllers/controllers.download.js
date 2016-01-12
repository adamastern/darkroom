function DownloadController(){

}

DownloadController.prototype.getImage = function(req, res, next){
	var imageName = req.params.imageName;
	res.json({
		name:imageName
	})
};

module.exports = DownloadController;