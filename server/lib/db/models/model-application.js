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
		currentDate = new Date(),
		doc;
	async.series([
		function(done) {
			//Find the user id for the primary applicant email
			var user = new userModel();

			user.findDocument({email: item.pEmail}, function(docs) {
				doc = docs[0].toObject();
				done();
			}, done);
		},
		function(done) {
			var application = new ApplicationModel();
			_.extend(item, {
				_id: appId,
				created: currentDate,
				lastModified: currentDate,
				pUID: doc._id
			});
			application.insert(item, done, done);
			done();
		},
		function(done) {
			var user = new userModel();
			//Update the userModel with the new appId
			doc.appId.push(appId);
			user.update(doc, {_id: doc._id}, null, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};

applicationModel.insertUserReference = function(item, success, failure) {
	var user = new userModel();
	user.insertOrUpdate(item, null, success, failure);
};
exports.Model = ApplicationModel;