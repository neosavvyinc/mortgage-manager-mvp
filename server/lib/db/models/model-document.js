'use strict';

var _ = require('underscore'),
	util = require('util'),
	async = require('async'),
	Schemas = require('../schemas').Schemas,
	commonUtils = require('../../utils/common-utils'),
	baseModel = require('./model-base'),
	applicationService = require('../../services/service-applications'),
	documentSchema = Schemas.DocumentSchema,
	documentModel;

/**
 * Constructor for the document model
 */
function DocumentModel() {
	DocumentModel.super_.call(this);
}

util.inherits(DocumentModel, baseModel.Model);

documentModel = DocumentModel.prototype;

documentModel.init('document', documentSchema);

documentModel.insertNewDocument = function(documents,
										   success,
										   failure) {
	async.series([
		function(done){
			async.parallel(
				_.range(documents.length).map(function(index){
					return function(done){
						var docUUID = commonUtils.generateId(),
							currentDate = commonUtils.getCurrentDate(),
							document = new DocumentModel();
						_.extend(documents[index],{
							_id: docUUID,
							requestDate: currentDate
						});
						document.insert(documents[index], done, done);
					};
				}),
				function(error){
					if(error !== undefined){
						done(error);
					} else {
						done();
					}
			});
		},
		function(done){
			applicationService.insertDocuments(documents, done, done);
		}
	], function(error){
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Function that saves a file on the server and saves the path in Mongo
 * @param document
 * @param success
 * @param failure
 */
documentModel.insertOnedocument = function(document, success, failure) {
	documentModel.insert(document, success, failure);
};

exports.Model = DocumentModel;