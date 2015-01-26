'use strict';

var async = require('async'),
	_ = require('underscore'),
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
	var createdCoApp;

	async.series([
		function(done) {
			//Create coapplicant credentials in user schema
			var user = new userModel();
			// TODO: generate default password and send it to coapplicant email
			user.insertOrUpdate({email: coapplicant.email, password: 'default', type: coapplicant.type}, {email: coapplicant.email}, function(coapp) {
				createdCoApp = coapp;
				done();
			}, done);
		},
		function(done) {
			//Create coapplicant details in user details schema
			var userDetails = new userDetailsModel();

			//Delete details from coapplicant that we don't want to persist in the user details schema
			delete coapplicant.email;
			delete coapplicant.password;
			delete coapplicant.type;

			coapplicant._id = createdCoApp._id;

			userDetails.insertOrUpdate(coapplicant, function() {
				done();
			}, done);
		},
		function(done) {
			var userDetails = new userDetailsModel();
			//Update the user to point to the coapplicant id
			userDetails.insertOrUpdate({_id: userId, coUID: createdCoApp._id}, function() {
				done();
			}, done);
		}
	], function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.findUserWithDetails = function(uid, success, failure){
	var user = new userModel();
	var userDetails = new userDetailsModel();

	var userWithDetails = {};

	async.series([
		function(done){
			userDetails.retrieve({_id: uid}, function(data){
				userWithDetails = data[0].toObject();
				done();
			}, done);
		},
		function(done){
			user.retrieve({_id: uid}, function(data){
				_.extend(userWithDetails, {
					type: data[0].toObject().type
				});
				done();
			});
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success(userWithDetails);
		}
	});
};