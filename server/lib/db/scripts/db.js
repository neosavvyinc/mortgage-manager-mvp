'use strict';

var mongoose = require('mongoose/');

/**
 * Establishes connection to the mongo server. All good if already
 * connected.
 * @param url of server to connect to
 * @param success handler: function() {}
 * @param failure handler: function(error) {}
 */
exports.connect = function(url, success, failure) {
	mongoose.connect(url, null, function(error) {
		if(error) {
			//Already connected? - Return success.
			if(error.hasOwnProperty('state') && error.state === 1) {
				success();
			} else {
				failure(new Error(error));
			}
		} else {
			success();
		}
	});
};

/**
 * Disconnects from the mongo server if already connected
 * @param callback when complete: function(error) {}
 */
exports.disconnect = function(callback) {
	if(mongoose.connection === null) {
		callback();
	} else {
		mongoose.disconnect(callback);
	}
};

/**
 * Drops the database we are currently connected to and reconnects
 * with clean slate
 * @param success handler: function() {}
 * @param failure handler: function(error) {}
 */
exports.clear = function(success, failure) {
	if(mongoose.connection === null) {
		failure(new Error('not opened'));
	} else {
		mongoose.connection.db.dropDatabase(function(error) {
			if(error === undefined) {
				exports.connect(mongoose.connection.url, success, failure);
			} else {
				failure(error);
			}
		});
	}
};