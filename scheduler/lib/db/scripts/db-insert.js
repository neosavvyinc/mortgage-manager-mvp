'use strict';

var dbInsert,
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	util = require('util'),
	_ = require('underscore'),
	dbBase = require('./db-base'),
	userModel = require('../models/model-user').Model,
	userDetailsModel = require('../models/model-user-details').Model,
	applicationModel = require('../models/model-application').Model,
	commonUtils = require('../../utils/common-utils'),
	errorUtils = require('../../utils/error-utils'),
	allJson = {},
	resourcesPath;

/**
 * Create database constructor
 * @param url
 * @constructor
 */
function DbInsert(url) {
	DbInsert.super_.call(this, url);
}

util.inherits(DbInsert, dbBase.Db);

dbInsert = DbInsert.prototype;

/**
 * Imports all the json files into mongodb
 * @param success
 * @param failure
 */
dbInsert.operation = function(success, failure) {
	var files = [];
	resourcesPath = path.resolve(__dirname.split('scripts')[0] + 'resources');
	async.series([
			function(done) {
				files = getResources(resourcesPath,
					function(fileArray) {
						files = fileArray;
						done();
					}, done);
			},
			function(done) {
				saveToMongo(files, done, done);
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

/**
 * Get mongoose id for a document based on specified model and conditions
 * @param model
 * @param conditions
 * @param success
 * @param failure
 */
dbInsert.getMongoId = function(model, conditions, success, failure) {
	model.findOneDocument(conditions, function(document) {
		success(document._id);
	}, failure);
};

/**
 * Returns an array of json files in the specified path
 * @param resourcePath - Path to the json files to be imported
 * @param success
 * @param failure
 */
var getResources = function(resourcePath, success, failure) {
	var files = [];
	errorUtils.handleErrors(function() {
		files = fs.readdirSync(resourcePath);
	}, failure);
	success(files);
};

/**
 * Saves each json file in the array to mongo.
 * @param files - Array of json files
 * @param success
 * @param failure
 */
var saveToMongo = function(files, success, failure) {
	async.eachSeries(files, iterateFiles,
		function(error) {
			if(error) {
				failure(error);
			} else {
				success();
			}
		});
};

/**
 * Iterator for async.each - Iterates over a list of files
 * @param file - filename of json
 * @param next - callback for async.each
 */
var iterateFiles = function(file, next) {
	saveFile(file, function() {
		next(); //Success
	},
	function(error) {
		next(error); //Failure
	});
};

/**
 * Save data from json to mongo
 * @param file
 * @param success
 * @param failure
 */
var saveFile = function(file, success, failure) {
	var absolutePath = resourcesPath + '/' + file,
		dbModel = file.split('.')[1];

	if(dbModel === 'user') {
		allJson.user = commonUtils.readJSON(absolutePath);
		saveUsers(allJson, success, failure);
	} else if(dbModel === 'userdetails') {
		allJson.userdetails = commonUtils.readJSON(absolutePath);
		saveUserDetails(allJson, success, failure);
	} else if(dbModel === 'application') {
		allJson.application = commonUtils.readJSON(absolutePath);
		saveApplications(allJson, success, failure);
	} else {
		failure('No model found with name ' + dbModel);
	}
};

/**
 * Save users to mongo
 * @param json
 * @param success
 * @param failure
 */
var saveUsers = function(json, success, failure) {
	var data = _.isEmpty(json.user) ? [] : json.user,
		user = new userModel();

	async.eachSeries(data, function(item, done) {
		user.insertOrUpdate(item, { email: item.email }, function(updated) {
			item = updated;
			done();
		}, done);
	}, function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Save user details to mongo
 * @param json
 * @param success
 * @param failure
 */
var saveUserDetails = function(json, success, failure) {
	var data = _.isEmpty(json.userdetails) ? [] : json.userdetails,
		userDetails = new userDetailsModel(),
		user = new userModel();
	async.eachSeries(data, function(item, done) {
		async.series([
			function(done1) {
				user.retrieve({ email: item.email }, function(_id) {
					item._id = _id;
					done1();
				}, done1);
			},
			function(done1) {
				userDetails.insertOrUpdate(item, done1, done1);
			}
		], function(error) {
			if(error) {
				done(error);
			} else {
				done();
			}
		});
	}, function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Save applications to mongo
 * @param json
 * @param success
 * @param failure
 */
var saveApplications = function(json, success, failure) {
	var data = _.isEmpty(json.application) ? [] : json.application,
		application = new applicationModel();
	async.eachSeries(data, function(item, done) {
		application.insertNewApp(item, item, function(appId){
			done();
		}, done);
	}, function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.Db = DbInsert;