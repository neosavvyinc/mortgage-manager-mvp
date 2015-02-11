'use strict';

var async = require('async');
var userModel = require('../db/models/model-user').Model;
var userDetailsModel = require('../db/models/model-user-details').Model;
var passwordResetModel = require('../db/models/model-password-reset').Model;
var lenderInvitesModel = require('../db/models/model-lender-invites').Model;
var commonUtils = require('../utils/common-utils');
var mandrillService = require('./service-mandrill');
var bCrypt = require('bcrypt-nodejs');

/**
 * Function that gets the user document based on conditions specified.
 * @param conditions
 * @param callback
 */
exports.findUser = function(conditions, callback) {
	var user = new userModel();
	user.retrieve(conditions, function(doc) {
		callback(null, doc);
	},
	function(error) {
		callback(error, null);
	});
};

/**
 * Function that inserts a new User document
 * @param userObject
 * @param callback
 */
exports.createUser = function(userObject, callback) {
	var user = new userModel();
	user.insertOrUpdate(userObject, {email: userObject.email}, function(user) {
		callback(null, user);
	},
	function(error) {
		callback(error);
	});
};

/**
 * Checks it the email is already in the database
 * @param email
 * @param success
 * @param failure
 */
exports.emailExists = function(email, success, failure){
	var user = new userModel();
	user.findOneDocument({email: email}, function() {
			failure(new Error('The user already exists'));
		},
		function() {
			success();
		});
};

/**
 * Validates the user invite token
 * @param user
 * @param success
 * @param failure
 */
exports.validateInviteToken = function(user, success, failure){

	var lenderInvites = new lenderInvitesModel();
	if (user.token) {
		async.series([
			function (done) {
				lenderInvites.findOneDocument({email: user.email},
					function (invite) {
						if (invite && user.token && user.token === invite.token && invite.isOpen) {
							done();
						} else {
							failure(new Error('Invalid Token'));
						}
					}, success);
			},
			function (done) {
				lenderInvites.update({
					isOpen: false
				}, {
					email: user.email
				}, null, done, done);
			}
		], function (error) {
			if (error) {
				failure(error);
			} else {
				success();
			}
		});
	} else {
		success();
	}
};

/**
 * Sends an email using mandril
 * @param email
 * @param success
 * @param failure
 */
exports.forgotPassword = function (email, success, failure) {
	var user = new userModel(),
		userDetails = new userDetailsModel(),
		passwordReset = new passwordResetModel(),
		token = commonUtils.generateId(),
		passwordResetObject,
		userDet = {},
		userDoc = {};

	async.series([
		function(done) {
			user.retrieve({email: email}, function(doc) {
				if(doc.length > 0) {
					userDoc = doc[0].toObject();
					done();
				} else {
					done(new Error('User does not exist!'));
				}
			}, function(error) {
				done(error);
			});
		},
		function(done) {
			//Check if password reset already exists and remove
			passwordReset.retrieve({_id: userDoc._id}, function(doc) {
				if(doc.length > 0) {
					passwordResetObject = doc[0].toObject();
					passwordReset.remove(passwordResetObject, done, done);
				} else {
					done();
				}
			}, done);
		},
		function(done) {
			//Insert new entry into password reset
			passwordResetObject = {
				_id: userDoc._id,
				token: token
			};
			passwordReset.insert(passwordResetObject, done, done);
		},
		function(done) {
			userDetails.retrieve({_id: userDoc._id}, function(doc) {
				userDet = doc[0].toObject();
				done();
			}, function(error) {
				done(error);
			});
		},
		function(done) {
			mandrillService.forgotPassword(email, userDet, token, done);
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
 * Updates the user password by validating the token and checking for expiry
 * @param uid
 * @param userDetails
 * @param success
 * @param failure
 */
exports.updatePassword = function(uid, userDetails, success, failure) {
	var user = new userModel(),
		passwordReset = new passwordResetModel(),
		passwordResetObject,
		userDoc;

	async.series([
		function(done) {
			//Get the user from mongo
			user.retrieve({_id: uid}, function(doc) {
				userDoc = doc[0].toObject();
				if(userDetails.oldPassword !== null && _isValidPassword(userDetails.oldPassword, userDoc.password)) {
					done(new Error('Password entered is incorrect.'));
				} else {
					done();
				}
			}, done);
		},
		function(done) {
			//Check if token matches
			passwordReset.retrieve({_id: uid}, function(doc) {
				if(doc.length > 0) {
					passwordResetObject = doc[0].toObject();
					if(userDetails.token !== null && passwordResetObject.token !== userDetails.token) {
						done(new Error('Token mismatch'));
					} else {
						done();
					}
				} else {
					done();
				}
			}, done);
		},
		function(done) {
			//Delete password reset entry
			passwordReset.remove(passwordResetObject, done, done);
		},
		function(done) {
			//Update user with new password
			userDoc.password = userDetails.password;
			user.insertOrUpdate(userDoc, {_id: userDoc._id}, function() {
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
 * Checks if a password is valid
 * @param user
 * @param password
 * @returns {*}
 * @private
 */
var _isValidPassword = function(oldPassword, newPassword) {
	return bCrypt.compareSync(oldPassword, newPassword);
};












