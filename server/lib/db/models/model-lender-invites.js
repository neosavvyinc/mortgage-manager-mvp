'use strict';

var util = require('util'),
	mongoose = require('mongoose/'),
	Schemas = require('../schemas').Schemas,
	lenderSchema = Schemas.LenderInvitesSchema,
	baseModel = require('./model-base'),
	invitesModel;

/**
 * Constructor for the lenderInvites model
 */
function LenderInvitesModel() {
	LenderInvitesModel.super_.call(this);
}

util.inherits(LenderInvitesModel, baseModel.Model);

invitesModel = LenderInvitesModel.prototype;

invitesModel.init('lenderInvites', lenderSchema);

exports.Model = LenderInvitesModel;