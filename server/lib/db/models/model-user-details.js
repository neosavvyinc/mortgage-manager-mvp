'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	baseModel = require('./model-base'),
	applicationLendersModel = require('./model-application-lenders').Model,
	Schemas = require('../schemas').Schemas,
	userDetailsSchema = Schemas.UserInfoSchema,
	userDetailsModel;

/**
 * Constructor for the user model
 */
function UserDetailsModel() {
	UserDetailsModel.super_.call(this);
	UserDetailsModel.prototype.init('userdetails', userDetailsSchema);
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
	var applicationLenders = new applicationLendersModel();
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
					appId: item.appId ? [item.appId] : []
				});
				async.parallel([
					function(cb){
						userDetailsModel.insert(item, cb, cb);
					},
					function(cb){
						if(item.appId){
							applicationLenders.insert({
								lenderId: item._id,
								appId: [item.appId]
							}, cb, cb);
						} else {
							cb();
						}
					}
				],function(error){
					if(error){
						done(error);
					} else {
						done();
					}
				});
			} else {
				userDetailsModel.update(item, {_id: docs[0]._id }, null, done, done);
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