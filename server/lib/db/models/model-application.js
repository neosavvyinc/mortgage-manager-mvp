'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/common-utils'),
	Schemas = require('../schemas').Schemas,
	applicationSchema = Schemas.ApplicationSchema,
	userDetailsModel = require('./model-user-details').Model,
	userModel = require('./model-user').Model,
	applicationModel;

/**
 * Constructor for the application model
 */
function ApplicationModel() {
	ApplicationModel.super_.call(this, 'application', applicationSchema);
}

util.inherits(ApplicationModel, baseModel.Model);

applicationModel = ApplicationModel.prototype;

/**
 * Inserts a new application document into mongo.
 * @param item
 * @param success
 * @param failure
 */
applicationModel.insertNewApp = function(item, success, failure) {
	var appId = commonUtils.generateId(),
		currentDate = commonUtils.getCurrentDate(),
		userDoc,
		userDetailsDoc;
	async.series([
		function(done) {
			//Find the user id for the primary applicant email
			var user = new userModel();
			user.findOneDocument({ email: item.pEmail }, function(document) {
				userDoc = document;
				done();
			}, done);
		},
		function(done) {
			//Get the user details if user exists
			var	userDetails = new userDetailsModel();
			userDetails.findOneDocument({ _id: userDoc._id }, function(document) {
				userDetailsDoc = document;
				done();
			}, done);
		},
		function(done) {
			var application = new ApplicationModel();
			_.extend(item, {
				_id: appId,
				created: currentDate,
				lastModified: currentDate,
				pUID: userDoc._id
			});
			application.insert(item, done, done);
		},
		function(done) {
			var userDetails = new userDetailsModel();
			//Update the userDetailsModel with the new appId
			userDetailsDoc.appId.push(appId);
			if(userDetailsDoc.toObject !== undefined ) {
				userDetailsDoc = userDetailsDoc.toObject();
			}
			userDetails.update(userDetailsDoc, {_id: userDetailsDoc._id}, null, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
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