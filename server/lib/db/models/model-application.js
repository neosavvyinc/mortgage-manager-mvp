'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/common-utils'),
	Schemas = require('../schemas').Schemas,
	applicationSchema = Schemas.ApplicationSchema,
	userDetailsModel = require('./model-user-details').Model,
	applicationModel;

/**
 * Constructor for the application model
 */
function ApplicationModel() {
	ApplicationModel.super_.call(this);
	ApplicationModel.prototype.init('application', applicationSchema);
}

util.inherits(ApplicationModel, baseModel.Model);

applicationModel = ApplicationModel.prototype;

/**
 * Inserts a new application document into mongo.
 * @param item
 * @param success
 * @param failure
 */
applicationModel.insertNewApp = function(applicantDetails,
										 coapplicantDetails,
										 success,
										 failure) {
	var appId = commonUtils.generateId(),
		currentDate = commonUtils.getCurrentDate(),
		item = {};
	async.series([
		function(done) {
			var application = new ApplicationModel();
			_.extend(item, {
				_id: appId,
				created: currentDate,
				lastModified: currentDate,
				pUID: applicantDetails._id,
				documents: [],
				status: 0
			});
			if(coapplicantDetails){
				_.extend(item, {
					cUID: coapplicantDetails._id
				});
			}
			application.insert(item, done, done);
		},
		function(done) {
			var userDetails = new userDetailsModel();
			//Update the userDetailsModel with the new appId
			applicantDetails.appId.push(appId);
			if(applicantDetails.toObject !== undefined ) {
				applicantDetails = applicantDetails.toObject();
			}
			userDetails.update(applicantDetails, {_id: applicantDetails._id}, null, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success(appId);
		}
	});
};

exports.Model = ApplicationModel;