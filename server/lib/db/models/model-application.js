'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/common-utils'),
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
		currentDate = commonUtils.getCurrentDate(),
		doc;
	async.series([
		function(done) {
			//Find the user id for the primary applicant email
			var user = new userModel();
			user.retrieve({email: item.pEmail}, function(docs) {
				if(docs.length === 1) {
					doc = docs[0];
					done();
				} else if(docs.length < 1) {
					done('Error: No documents found');
				} else {
					done('Error: More than 1 document found');
				}
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
		},
		function(done) {
			var user = new userModel();
			//Update the userModel with the new appId
			doc.appId.push(appId);
			if(doc.toObject !== undefined ) {
				doc = doc.toObject();
			}
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

exports.Model = ApplicationModel;