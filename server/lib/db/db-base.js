'use strict';

var dbBase,
	db = require('./db'),
	async = require('async');

/**
 * Base class for the database
 * @param url
 * @constructor
 */
function Db(url) {
	this.url = url;
}

dbBase = Db.prototype;

/**
 * Function that connects to the database
 * @param success
 * @param failure
 * @param self
 */
dbBase.initialize = function(self, success, failure) {
	var connectionUrl = self.url;
	db.connect(connectionUrl, success, failure);
};

/**
 * Function that defined an operation - insert/retrieve/update
 * @abstract
 * @param success
 * @param failure
 */
dbBase.operation = function(success, failure) {
	throw new Error('Must implement');
};

/**
 * Function that runs an operation - insert/retrieve/update
 * @abstract
 * @param success
 * @param failure
 */
dbBase.run = function(success, failure) {
	var self = this;
	async.series([
		function(done) {
			self.initialize(self, done, done);
		},
		function(done) {
			self.operation(done, done);
		}
	],
	function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.Db = Db;