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
	DocumentModel.super_.call(this, 'user', documentSchema);
}

util.inherits(DocumentModel, baseModel.Model);

documentModel = DocumentModel.prototype;

exports.Model = DocumentModel;