'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/commonUtils'),
	Schemas = require('../schemas').Schemas,
	applicationSchema = Schemas.ApplicationSchema,
	userModel = require('./model-user').Model,
	applicationModel;

/**
 * Constructor for the application model
 */
function ApplicationModel() {
	ApplicationModel.super_.call(this, 'user', applicationSchema);
}

util.inherits(ApplicationModel, baseModel.Model);

applicationModel = ApplicationModel.prototype;

/**
 *
 * @param item
 * @param success
 * @param failure
 */
applicationModel.insertNewApp = function(item, success, failure) {
	var appId = commonUtils.generateId(),
		currentDate = new Date();

	async.series([
		function(done) {
			_.extend(item, {
				_id: appId,
				created: currentDate,
				lastModified: currentDate
			});
			applicationModel.insert(item, done, done);
		},
		function(done) {
			//Update the userModel with the new appId
			var user = new userModel();
			user.update(item, {_id: item.pUID}, null, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.Model = ApplicationModel;