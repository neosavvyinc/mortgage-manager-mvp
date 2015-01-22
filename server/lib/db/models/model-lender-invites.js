'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	lenderSchema = Schemas.LenderInvitesSchema,
	baseModel = require('./model-base'),
	invitesModel;

/**
 * Constructor for the lenderInvites model
 */
function LenderInvitesModel() {
	LenderInvitesModel.super_.call(this);
	LenderInvitesModel.prototype.init('lenderInvites', lenderSchema);
}

util.inherits(LenderInvitesModel, baseModel.Model);

invitesModel = LenderInvitesModel.prototype;

exports.Model = LenderInvitesModel;