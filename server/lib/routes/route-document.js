'use strict';

var path = require('path'),
	_ = require('underscore'),
	async = require('async'),
	sizeOf = require('image-size'),
	phantom = require('../phantomjs/phantom'),
	commonUtils = require('../utils/common-utils'),
	settings = require('../config/app/settings'),
	documentService = require('../services/service-document'),
	s3Service = require('../services/service-s3');

/**
 * Route handler for new documents
 * @param s3Client
 */
exports.insertDocument = function(s3Client) {
	return function(req, res) {
		var documentObject = JSON.parse(req.body.details),
			file = req.files.file,
			appId = req.params.appId;

		//If file does not exist multer has filtered it for wrong extension.
		if(file === undefined) {
			settings.log.fatal('Unsupported Media type');
			res.status(415).send({message: 'Unsupported Media type'});
		} else {
			_handleUpload(s3Client, documentObject, appId, file, function() {
				res.send({message: 'Success'}).end();
				settings.log.info('Successfully uploaded document ' + file.name + '. AppId: '+appId);
			}, function(error) {
				settings.log.fatal(error.message || error);
				res.status(500).send({message: 'Internal Server Error'}).end();
			});
		}
	};
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
 * Handles uploads for both node and s3
 * @param s3Client
 * @param documentObject
 * @param appId
 * @param file
 * @param success
 * @param failure
 * @private
 */
var _handleUpload = function(s3Client, documentObject, appId, file, success, failure) {
	var originalFilePath = file.path,
		extension = file.extension,
		convertedPdfPath,
		originalDest,
		convertedDest,
		s3Toggle = settings.getConfig().s3.s3Toggle;

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
			//Move the original file (Can be both images and pdf)
			originalDest = _moveFile(appId, originalFilePath);

			//If convertedPdfPath exists, it means the file was converted to pdf
			if(convertedPdfPath !== undefined) {
				convertedDest = _moveFile(appId, convertedPdfPath);

				if(s3Toggle) {
					documentObject.originalUrl = originalDest.split('uploads/')[1];
				} else {
					documentObject.originalUrl = originalDest;
				}
			}

			if(s3Toggle) {
				var url = (convertedPdfPath === undefined) ? originalDest : convertedDest;
				_.extend(documentObject, {
					url: url.split('uploads/')[1],
					appId: appId
				});
			} else {
				_.extend(documentObject, {
					url: (convertedDest === undefined) ? originalDest : convertedDest,
					appId: appId
				});
			}

			//Call the document service to save Document
			documentService.saveDocument(documentObject, function() {
				done();
			}, function(error) {
				done(error);
			});
		},
		function(done) {
			//Post to S3
			if(s3Toggle) {
				var fileArr = [originalDest];

				if(convertedPdfPath!== undefined) {
					fileArr.push(convertedDest);
				}
				//Post the original file to S3
				_postToS3(s3Client, fileArr, documentObject.name+'.pdf', appId, done, done);
			} else {
				done();
			}
		},
		function(done) {
			//Delete files from node after uploading to s3.
			if(s3Toggle) {
				if (convertedPdfPath !== undefined) {
					commonUtils.deleteFileSync(convertedDest, function() {
						settings.log.info('Deleting file from node. Path: '+convertedDest);
					}, done);
				}
				commonUtils.deleteFileSync(originalDest, function() {
					settings.log.info('Deleting file from node. Path: '+originalDest);
				}, done);
				done();
			} else {
				done();
			}
		}
	], function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
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

/**
 * Helper function to move file to uploads/appId/
 * @param appId
 * @param source
 * @private
 */
var _moveFile = function(appId, source) {
	var split = source.split('uploads'),
		destination = split[0] + 'uploads/' + appId + split[1];

	commonUtils.moveFiles(path.resolve(source), path.resolve(destination));
	return destination;
};

/**
 * Post to S3
 * @param s3Client
 * @param pathArr
 * @param name
 * @param appId
 * @param success
 * @param failure
 * @private
 */
var _postToS3 = function(s3Client, pathArr, name, appId, success, failure) {
	async.each(pathArr, function(path, done) {
		s3Service.postFile(s3Client, name, path, appId, path.split('uploads/')[1], function () {
			settings.log.info('Successful upload to S3 from path: ', path);
			done();
		}, function (error) {
			done(error);
		});
	}, function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};