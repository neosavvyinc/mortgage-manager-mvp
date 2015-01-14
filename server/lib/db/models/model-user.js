'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	bCrypt = require('bcrypt-nodejs'),
	baseModel = require('./model-base'),
	commonUtils = require('../../utils/common-utils'),
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
 * @param condition
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
				var password = _createHash(item.password);
				_.extend(item, {
					_id: uid,
					created: currentDate,
					lastLogin: currentDate,
					appId: []
				});

				item.password = password;
				userModel.insert(item, done, done);
			} else {
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

/**
 * Generates hash using bCrypt
 * @param password
 * @returns {*}
 * @private
 */
var _createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

exports.Model = UserModel;