'use strict';

var dbInsert,
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	util = require('util'),
	_ = require('underscore'),
	dbBase = require('./db-base'),
	models = require('./model'),
	commonUtils = require('../utils/commonUtils'),
	errorUtils = require('../utils/errorUtils'),
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
 */
dbInsert.operation = function(success, failure) {
	var files = [];
	resourcesPath = path.resolve(__dirname + '/resources');
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
 * @param saveCallback - iterator that saves one file at a time.
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
 * Function that searches for the mongo object id in a json.
 * @param id
 * @param json
 * @returns {*}
 */
var getMongoId = function(id, json) {
	var result;
	if(id === null) {
		return undefined;
	}
	result = _.find(json, function(item) {
		return (item.id === id);
	});

	if(result === null) {
		throw new Error(util.format('failed to find referenced id=%s', id));
	}
	return result._id;
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
		dbModel = file.split('.')[0];

	if(dbModel === 'logins') {
		allJson.logins = commonUtils.readJSON(absolutePath);
		saveLogins(allJson, success, failure);
	} else {
		failure('No model found with name ' + dbModel);
	}
};

/**
 * Save logins to mongo
 * @param json
 * @param success
 * @param failure
 */
var saveLogins = function(json, success, failure) {
	var options = { upsert: true },
		data = _.isEmpty(json) ? [] : json.logins;

	async.eachSeries(data, function(item, done) {
		var error = null;
		models.Auth.findOneAndUpdate({name: item.username}, item, options, function(err, dbi) {
			if(err) {
				error = 'Attempt to insert/update '+ item.username + ' failed: ' + err.message;
			} else {
				item._id = dbi.id;
			}
			done(error);
		});
	}, function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

exports.Db = DbInsert;