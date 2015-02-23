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

	//If file does not exist, either s3 is being used or
	// multer has filtered it for wrong extension.

	if(file === undefined) {
		if(settings.getConfig().s3.s3Toggle) {
			settings.log.fatal('S3 is being used');
			res.status(415).send({message: 'S3 is still under implementation'});
		} else {
			settings.log.fatal('Unsupported media type');
			res.status(415).send({message: 'Unsupported Media type'});
		}
	} else {
		var originalFilePath = file.path,
			extension = file.extension,
			convertedPdfPath,
			originalDest;

		async.series([
			function(done) {
				//Convert if the file is not pdf
				if(extension !== 'pdf') {
					var	pathArr = originalFilePath.split('.'),
						targetPath = pathArr[0] + '.pdf';

					_convertToPdf(originalFilePath, targetPath, done, done);
					convertedPdfPath = targetPath;
				} else {
					done();
				}
			},
			function(done) {
				//Move uploaded files and save url to original as well as converted
				var convertedDest;

				//Move the original file (Can be both images and pdf)
				originalDest = _moveFile(appId, originalFilePath);

				//If convertedPdfPath exists, it means the file was converted to pdf
				if(convertedPdfPath !== undefined) {
					convertedDest = _moveFile(appId, convertedPdfPath);
					documentObject.originalUrl = originalDest;
				}

				_.extend(documentObject, {
					url: (convertedDest === undefined) ? originalDest : convertedDest,
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
				settings.log.fatal(error.message || error);
				res.status(500).send({message: 'Internal Server Error'});
			} else {
				res.send({message: 'Success'});
				settings.log.info('Successfully uploaded document ' + file.name + '. AppId: '+appId);
			}
			res.end();
		});
	}
};

/**
 * Insert an entry for one document in mongo
 * @param req
 * @param res
 */
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

/**
 * Download all documents in a zip format
 * @param req
 * @param res
 */
exports.downloadAllDocuments = function(req, res) {
	var appId = req.params.appId;

	documentService.createDocumentZip(appId, function(zipUrl) {
		res.download(zipUrl, 'MortgageDocuments.zip', function(error) {
			settings.log.info('Downloading all documents for appId: ' + appId);
			if (error) {
				settings.log.fatal(error);
			} else {
				documentService.deleteZip(zipUrl, function() {
					settings.log.info('Deleted zip file successfully');
				}, function(error) {
					settings.log.fatal(error);
				});
			}
		});
	}, function(error) {
		settings.log.fatal(error);
		res.status(500).send({message: 'Internal Server Error'});
	});
};

/**
 * Helper function to move file to uploads/appId/
 * @param appId
 * @param source
 * @private
 */
var _moveFile = function(appId, source) {
	var split = source.split('uploads'),
		destination = split[0] + 'uploads/' + appId + '/' + split[1];

	commonUtils.moveFiles(path.resolve(source), path.resolve(destination));

	return destination;
};

/**
 * Helper function that converts images to pdf
 * @param sourcePath
 * @param targetPath
 * @param success
 * @param failure
 * @private
 */
var _convertToPdf = function(sourcePath, targetPath, success, failure) {
	var dimensions = sizeOf(sourcePath),
		captureOptions = {
			width: dimensions.width,
			height: dimensions.height,
			delay: 200
		};

	//Convert to pdf
	phantom.convertToPdf(sourcePath, targetPath, captureOptions, function () {
		success();
	}, function (error) {
		failure(new Error('Could not convert to pdf ' + error));
	});
};