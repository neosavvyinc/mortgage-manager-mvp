'use strict';

var util = require('util'),
	mongoose = require('mongoose/'),
	Schemas = require('../schemas').Schemas,
	documentSchema = Schemas.DocumentSchema,
	baseModel = require('./model-base'),
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

exports.Model = DocumentModel;