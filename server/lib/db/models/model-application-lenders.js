'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	appLendersSchema = Schemas.ApplicationLendersSchema,
	baseModel = require('./model-base'),
	appLendersModel;

/**
 * Constructor for the applicationLenders model
 */
function ApplictionLendersModel() {
	ApplictionLendersModel.super_.call(this);
	ApplictionLendersModel.prototype.init('user', appLendersSchema);
}

util.inherits(ApplictionLendersModel, baseModel.Model);

appLendersModel = ApplictionLendersModel.prototype;

exports.Model = ApplictionLendersModel;