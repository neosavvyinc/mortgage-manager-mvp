'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	Schemas = require('../schemas').Schemas,
	userDetailsSchema = Schemas.UserInfoSchema,
	userDetailsModel;

/**
 * Constructor for the user model
 */
function UserDetailsModel() {
	UserDetailsModel.super_.call(this, 'userdetails', userDetailsSchema);
}

util.inherits(UserDetailsModel, baseModel.Model);

userDetailsModel = UserDetailsModel.prototype;

/**
 * Function that inserts/updates specified document in the user collection.
 * @param item
 * @param success
 * @param failure
 * @private
 */
userDetailsModel.insertOrUpdate = function(item, success, failure) {
	var currentDate = new Date(),
		docs;

	async.series([
		function(done) {
			docs = new UserDetailsModel().retrieve({ _id: item._id }, function(documents) {
				docs = documents;
				done();
			}, done);
		},
		function(done) {
			if(_.isEmpty(docs)) {
				_.extend(item, {
					created: currentDate,
					lastLogin: currentDate,
					appId: []
				});
				userDetailsModel.insert(item, done, done);
			} else {
				userDetailsModel.update(item, {_id: docs._id }, null, done, done);
			}
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.Model = UserDetailsModel;