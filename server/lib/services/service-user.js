'use strict';

var async = require('async');
var userModel = require('../db/models/model-user').Model;
var lenderInvitesModel = require('../db/models/model-lender-invites').Model;

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

exports.validateInviteToken = function(user, success, failure){

	var lenderInvites = new lenderInvitesModel();

	async.series([
		function(done){
			lenderInvites.findOneDocument({ email: user.email },
				function(invite) {
					if (invite && user.token && user.token === invite.token && invite.isOpen) {
						done();
					} else {
						failure(new Error('Invalid Token'));
					}
				}, success);
		},
		function(done){
			lenderInvites.update({
				email: user.email
			}, {
				isOpen: false
			}, null, done, done);
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success();
		}
	});

};






























