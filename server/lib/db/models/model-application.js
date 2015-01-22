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

/**
 * Update an application with the update object specified
 * @param appId
 * @param update
 * @param success
 * @param failure
 */
applicationModel.updateApplication = function(appId, update, success, failure) {
	var app = {};
	async.series([
		function(done) {
			//Get Application object
			var application = new ApplicationModel();
			application.findOneDocument({_id: appId}, function(document) {
				app = document.toObject();
				done();
			}, done)
		},
		function(done) {
			//Update the object and save in mongo
			var application = new ApplicationModel();
			update.documents = _.union(app.documents, update.documents);
			_.extend(app, update);
			application.update(app, {_id: app._id}, null, done, done);
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