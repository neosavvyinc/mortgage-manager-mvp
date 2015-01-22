'use strict';

var _ = require('underscore'),
	async = require('async'),
	commonUtils = require('../../lib/utils/common-utils'),
	documentModel = require('../db/models/model-document').Model,
	applicationModel = require('../db/models/model-application').Model;

/**
 * Service that handles storing a document in mongo for a particular application
 * @param appId
 * @param doc
 * @param success
 * @param failure
 */
exports.saveDocument = function(doc, success, failure) {
	var docId = commonUtils.generateId(),
		currentDate = new Date();

	async.series([
		function(done) {
			//Store the document in mongo
			var document = new documentModel();
			_.extend(doc, {
				_id: docId,
				requestDate: currentDate,
				uploadDate: currentDate
			});
			document.insertNewdocument(doc, done, done);
		},
		function(done) {
			//Add the document to doc array in application collection
			var application = new applicationModel();
			application.updateApplication(doc.appId, {documents: [docId]}, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};