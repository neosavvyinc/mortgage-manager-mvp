'use strict';

var path = require('path'),
	_ = require('underscore'),
	async = require('async'),
	sizeOf = require('image-size'),
	phantom = require('../phantomjs/phantom'),
	commonUtils = require('../utils/common-utils'),
	settings = require('../config/app/settings'),
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
		settings.log.fatal('Unsupported media type');
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
						pathArr = uploadPath.split('.'),
						targetPath = pathArr[0] + '.pdf';

					//Convert to pdf
					phantom.convertToPdf(uploadPath, targetPath, captureOptions, function () {
						updatedUploadPath = targetPath;
						done();
					}, function (error) {
						done(new Error('Could not convert to pdf ' + error));
					});
				} else {
					settings.log.info('Successfully converted pdf. Updated path is '+updatedUploadPath);
					done();
				}
			},
			function(done) {
				var updatedUploadSplit,
					updatedDest;

				if(updatedUploadPath !== undefined) {
					updatedUploadSplit = updatedUploadPath.split('uploads');
					updatedDest = updatedUploadSplit[0] + 'uploads/' + appId + '/' + updatedUploadSplit[1];
					commonUtils.moveFiles(path.resolve(updatedUploadPath), path.resolve(updatedDest));
				}

				splitPath = uploadPath.split('uploads');
				destPath = splitPath[0] + 'uploads/' + appId + '/' + splitPath[1];

				//Move the uploaded files before calling the service
				commonUtils.moveFiles(path.resolve(uploadPath), path.resolve(destPath));

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
				settings.log.fatal(error.message);
				res.status(500).send({message: 'Internal Server Error'});
			} else {
				res.send({message: 'Success'});
				settings.log.info('Successfully uploaded document ' + file.name + '. AppId: '+appId);
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
		settings.log.info('Successfully created a doc entry. AppId: '+req.params.appId);
	}, function(error) {
		settings.log.fatal(error.message);
		res.status(500).send({message: 'Internal Server Error'}).end();
	});

};