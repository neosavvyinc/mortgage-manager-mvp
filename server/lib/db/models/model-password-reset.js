'use strict';

var util = require('util'),
	baseModel = require('./model-base'),
	Schemas = require('../schemas').Schemas,
	passwordResetSchema = Schemas.PasswordResetSchema,
	passwordResetModel;

/**
 * Constructor for the user model
 */
function PasswordResetModel() {
	PasswordResetModel.super_.call(this);
	PasswordResetModel.prototype.init('password-reset', passwordResetSchema);
}

util.inherits(PasswordResetModel, baseModel.Model);

passwordResetModel = PasswordResetModel.prototype;

exports.Model = PasswordResetModel;