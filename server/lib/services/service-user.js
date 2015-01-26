'use strict';

var userModel = require('../db/models/model-user').Model;

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
			failure(new Error("The user already exists"));
		},
		function() {
			success();
		});
};