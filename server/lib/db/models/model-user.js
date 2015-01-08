'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/commonUtils'),
	Schemas = require('../schemas').Schemas,
	userSchema = Schemas.UserSchema,
	userModel;

/**
 * Constructor for the user model
 */
function UserModel() {
	UserModel.super_.call(this, 'user', userSchema);
}

util.inherits(UserModel, baseModel.Model);

userModel = UserModel.prototype;

/**
 * Function that inserts/updates specified document in the user collection.
 * @param item
 * @param success
 * @param failure
 * @private
 */
userModel.insertOrUpdate = function(item, condition, success, failure) {
	var uid = commonUtils.generateId(),
		currentDate = new Date(),
		docs;

	async.series([
		function(done) {
			docs = userModel.retrieve(condition, function(documents) {
				docs = documents;
				done();
			}, done);
		},
		function(done) {
			if(_.isEmpty(docs)) {
				_.extend(item, {
					_id: uid,
					created: currentDate,
					lastLogin: currentDate,
					appId: []
				});
				userModel.insert(item, done, done);
			} else {
				//Check if there is a new appid in item and push it to the array in docs
				var newAppId = item.appId;
				if(newAppId !== undefined) {
					_.extend(item, {
						appId: docs.appId.push(newAppId)
					});
				}
				userModel.update(item, {_id: docs._id }, null, done, done);
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

exports.Model = UserModel;