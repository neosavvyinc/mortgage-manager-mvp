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
}

util.inherits(ApplictionLendersModel, baseModel.Model);

appLendersModel = ApplictionLendersModel.prototype;

appLendersModel.init('user', appLendersSchema);

exports.Model = ApplictionLendersModel;