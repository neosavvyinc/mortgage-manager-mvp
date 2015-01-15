'use strict';

var async = require('async'),
	commonUtils = require('../utils/common-utils'),
	userDetailsModel = require('../db/models/model-user-details').Model,
	userModel = require('../db/models/model-user').Model;


/**
 * Function that updates a user in mongo
 * @param userObject - object with updated fields
 * @param success
 * @param failure
 */
exports.updateUser = function(userObject, success, failure) {
	var userDetails = new userDetailsModel();
	userDetails.insertOrUpdate(userObject, success, failure);
};

/**
 * Function that creates a coapplicant for a particular user
 * @param userId
 * @param coapplicant
 * @param success
 * @param failure
 */
exports.createCoApplicant = function(userId, coapplicant, success, failure) {
	var user = new userModel(),
		createdCoApp;

	async.series([
		function(done) {
			//Create a coapplicant
			user.insertOrUpdate(coapplicant, {email: coapplicant.email}, function(coapplicant) {
				done();
			}, done);
		},
		function(done) {
			//Update the user to point to the coapplicant id

		}
	], function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};
