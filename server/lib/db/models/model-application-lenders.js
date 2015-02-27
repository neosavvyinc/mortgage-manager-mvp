'use strict';

var util = require('util'),
	Schemas = require('../schemas').Schemas,
	appLendersSchema = Schemas.ApplicationLendersSchema,
	baseModel = require('./model-base'),
	appLendersModel;

/**
 * Constructor for the applicationLenders model
 */
function ApplicationLendersModel() {
    ApplicationLendersModel.super_.call(this);
    ApplicationLendersModel.prototype.init('applicationLender', appLendersSchema);
}

util.inherits(ApplicationLendersModel, baseModel.Model);

appLendersModel = ApplicationLendersModel.prototype;

exports.Model = ApplicationLendersModel;