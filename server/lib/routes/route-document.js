'use strict';

var _ = require('underscore'),
	async = require('async'),
	sizeOf = require('image-size'),
	phantom = require('../phantomjs/phantom'),
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
		appId = req.params.appId;

	//If file does not exist, multer has filtered it for wrong extension.
	if(file === undefined) {
		res.status(415).send({message: 'Unsupported Media type'});
	} else {
		var uploadPath = file.path,
			extension = file.extension,
			updatedUploadPath,
			splitPath,
			destPath;

		async.series([
			function(done) {
				if(extension !== 'pdf') {
					var dimensions = sizeOf(uploadPath),
						captureOptions = {
							width: dimensions.width,
							height: dimensions.height,
							delay: 200
						},
						pathArr = uploadPath.split('/'),
						targetPath = pathArr[0] + '/' + pathArr[1].split('.')[0] + '.pdf';

					//Convert to pdf
					phantom.convertToPdf(uploadPath, targetPath, captureOptions, function () {
						updatedUploadPath = targetPath;
						done();
					}, function (error) {
						done(new Error('Could not convert to pdf ' + error));
					});
				} else {
					done();
				}
			},
			function(done) {
				var updatedUploadSplit,
					updatedDest;

				if(updatedUploadPath !== undefined) {
					updatedUploadSplit = updatedUploadPath.split('/');
					updatedDest = updatedUploadSplit[0] + '/' + appId + '/' + updatedUploadSplit[1];
					commonUtils.moveFiles(updatedUploadPath, updatedDest);
				}

				splitPath = uploadPath.split('/');
				destPath = splitPath[0] + '/' + appId + '/' + splitPath[1];

				//Move the uploaded files before calling the service
				commonUtils.moveFiles(uploadPath, destPath);

				_.extend(documentObject, {
					url: (updatedDest === undefined) ? destPath : updatedDest,
					appId: appId
				});

				//Call the document service to save Document
				documentService.saveDocument(documentObject, function() {
					done();
				}, function(error) {
					done(error);
				});
			}
		], function(error) {
			if(error) {
				res.status(500).send({message: 'Internal Server Error'});
			} else {
				res.send({message: 'Success'});
			}
			res.end();
		});
	}
};

exports.insertDocumentEntry = function(req, res) {
	var documentObject = req.body;

	_.extend(documentObject, {
		appId: req.params.appId
	});

	documentService.createDocument(documentObject, function() {
		res.send({message: 'Success'}).end();
	}, function(error) {
		console.log(error);
		res.status(500).send({message: 'Internal Server Error'}).end();
	});

};