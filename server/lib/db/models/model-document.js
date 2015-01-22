'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	documentSchema = Schemas.DocumentSchema,
	baseModel = require('./model-base'),
	documentModel;

/**
 * Constructor for the document model
 */
function DocumentModel() {
	DocumentModel.super_.call(this, 'document', documentSchema);
}

util.inherits(DocumentModel, baseModel.Model);

documentModel = DocumentModel.prototype;

/**
 * Function that saves a file on the server and saves the path in Mongo
 * @param document
 * @param success
 * @param failure
 */
documentModel.insertNewdocument = function(document, success, failure) {
	documentModel.insert(document, success, failure);
};

exports.Model = DocumentModel;