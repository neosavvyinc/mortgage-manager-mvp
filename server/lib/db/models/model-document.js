'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	documentSchema = Schemas.DocumentSchema,
	async = require('async'),
	commonUtils = require('../../utils/common-utils'),
	baseModel = require('./model-base'),
	_ = require('underscore'),
	documentModel;

/**
 * Constructor for the document model
 */
function DocumentModel() {
	DocumentModel.super_.call(this);
	DocumentModel.prototype.init('document', documentSchema);
}

util.inherits(DocumentModel, baseModel.Model);

documentModel = DocumentModel.prototype;

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