'use strict';

var _ = require('underscore'),
	documentService = require('../services/service-document');

/**
 * Route handler for new documents
 * @param req
 * @param res
 */
exports.insertDocument = function(req, res) {
	var documentObject = req.body,
		file = req.files.file,
		appId = req.params.appId,
		extension = file.extension;


	//Do some validation for document extension
	if(extension!=='pdf' && extension!=='jpg' && extension!=='jpeg' && extension!=='png') {
		res.status(415).send({message: 'Unsupported Media type'});
	}

	_.extend(documentObject, {
		url: path,
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
};