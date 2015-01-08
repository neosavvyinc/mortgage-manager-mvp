'use strict';

var util = require('util'),
	_ = require('underscore'),
	uuid = require('node-uuid'),
	Schemas = require('../schemas').Schemas,
	userSchema = Schemas.UserSchema,
	baseModel = require('./model-base'),
	userModel;

/**
 * Constructor for the user model
 */
function UserModel() {
	UserModel.super_.call(this, 'user', userSchema);
}

util.inherits(UserModel, baseModel.Model);

userModel = UserModel.prototype;

var _generateId = function() {
	return uuid.v1();
};

/**
 * Function that inserts/updates specified document in the user collection.
 * @param item
 * @param success
 * @param failure
 * @private
 */
userModel.insertOrUpdate = function(item, success, failure) {
	var uid = _generateId(),
		appId = _generateId(),
		created = new Date(),
		docs;

	docs = userModel.retrieve({ email: item.email }, success, failure);

	if(_.isEmpty(docs)) {
		_.extend(item, {
			_id: uid,
			appId: appId,
			created: created,
			lastLogin: created
		});
		userModel.insert(item, success, failure);
	} else {
		userModel.update(item, {_id: docs[0]._id }, null, success, failure);
	}
};

exports.Model = UserModel;