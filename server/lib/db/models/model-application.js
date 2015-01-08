'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	applicationSchema = Schemas.ApplicationSchema,
	baseModel = require('./model-base'),
	userModel;

/**
 * Constructor for the application model
 */
function ApplicationModel() {
	ApplicationModel.super_.call(this, 'user', applicationSchema);
}

util.inherits(ApplicationModel, baseModel.Model);

userModel = ApplicationModel.prototype;

exports.Model = ApplicationModel;