var express = require('express');
var multer  = require('multer');
var apiResponseMiddleware = require('api-response-middleware');
var uploadController = new(require('../controllers/controllers.upload'))();
var downloadController = new(require('../controllers/controllers.download'))();
var router = express.Router();

var upload = multer({
	dest:'uploads/'
});

router.use(apiResponseMiddleware());

router.get('/:imageName', downloadController.getImage);
router.post('/upload', upload.single('image'), uploadController.upload);

module.exports = router;