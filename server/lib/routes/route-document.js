'use strict';

var _ = require('underscore'),
	commonUtils = require('../utils/common-utils'),
	documentService = require('../services/service-document');

/**
 * Route handler for new documents
 * @param req
 * @param res
 */
exports.insertDocument = function(req, res) {
	var documentObject = JSON.parse(req.body.details),
		file = req.files.file,
		appId = req.params.appId,
		uploadPath,
		splitPath,
		destPath;

	//If file does not exist, multer has filtered it for wrong extension.
	if(file === undefined) {
		res.status(415).send({message: 'Unsupported Media type'});
	} else {
		uploadPath = file.path;
		splitPath = uploadPath.split('/');
		destPath = splitPath[0] + '/' + appId +'/' + splitPath[1];

		//Move the uploaded files before calling the service
		commonUtils.moveFiles(uploadPath, destPath);

		_.extend(documentObject, {
			url: destPath,
			appId: appId
		});

		documentService.saveDocument(documentObject, function() {
			res.send({message: 'Success'});
			res.end();
		}, function(error) {
			if(error) {
				res.status(500).send({message: 'Internal Server Error'});
			}
			res.end();
		});
	}


};