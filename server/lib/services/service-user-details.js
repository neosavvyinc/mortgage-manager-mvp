'use strict';

var async = require('async'),
	_ = require('underscore'),
	userDetailsModel = require('../db/models/model-user-details').Model,
	userModel = require('../db/models/model-user').Model,
	lenderInvitesModel = require('../db/models/model-lender-invites').Model,
	applicationLendersModel = require('../db/models/model-application-lenders').Model;


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

/**
 * Retrieve a user with all the details including type of user
 * @param uid
 * @param success
 * @param failure
 */
exports.findUserWithDetails = function(uid, success, failure){
	var user = new userModel();
	var userDetails = new userDetailsModel();

	var userWithDetails = {};

	async.series([
		function(done){
			userDetails.retrieve({_id: uid}, function(data){
				if(data[0].toObject !== undefined ) {
					userWithDetails = data[0].toObject();
				}
				done();
			}, done);
		},
		function(done){
			user.retrieve({_id: uid}, function(data){
				if(data[0].toObject !== undefined ) {
					_.extend(userWithDetails, {
						type: data[0].toObject().type
					});
				}
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


exports.lenderAppInvite = function(email, token, appId, success, failure){

	var user = new userModel(),
		userDetails = new userDetailsModel(),
		lenderInvites = new lenderInvitesModel(),
		applicationLenders = new applicationLendersModel();

	var userBasicInfo;
	async.series([
		function(done){
			user.retrieve({email: email}, function(userData){
				userBasicInfo = userData[0];
                if(!userBasicInfo){
                    done(new Error('This user doesn\'t exist'));
                }
				done();
			}, done);
		},
		function(done){
			async.parallel([
				function(callback){
					var previousUserDets;
					async.series([
						function(cb){
							userDetails.retrieve({_id: userBasicInfo._id}, function(userDets){
								previousUserDets = userDets[0];
								cb();
							}, cb);
						},
						function(cb){
							if(_.indexOf(previousUserDets.appId, appId) < 0) {
								previousUserDets.appId.push(appId);
								userDetails.update({appId: previousUserDets.appId}, {_id: userBasicInfo._id}, null, cb, cb);
							} else {
								cb();
							}
						}
					], function(error){
						if(error){
							callback(error);
						} else {
							callback();
						}
					});
				},
				function(callback){
					lenderInvites.update({isOpen: false}, {appId: appId}, null, callback, callback);
				},
				function(callback){
					applicationLenders.insert({lenderId: userBasicInfo._id, appId: appId}, callback, callback);
				}
			],function(error){
				if(error){
					done(error);
				} else {
					done();
				}
			});
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success();
		}
	});
};