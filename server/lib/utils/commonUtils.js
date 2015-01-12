'use strict';

var log4js = require('log4js'),
	uuid = require('node-uuid'),
	settings = require('../config/app/settings'),
	fs = require('fs');

/**
 * Dereference an object chain. For example: var o={ a: { b: { c: 'chuck' } } } could be
 * dereferenced as follows dereference(o, 'a.b.c')
 * @param object to start with
 * @param path dotted chain of properties as in 'a.b.c'
 * @param dfault optional default value. Will return undefined if not specified.
 * @returns {*}
 */
exports.dereference=function(object, path, dfault) {
	var index, token,
		tokens = path.split('.');
	for(index=0; index<tokens.length; index++) {
		token = tokens[index];
		if(object !== null && object.hasOwnProperty(token)) {
			object = object[token];
		} else {
			return dfault;
		}
	}
	return object;
};

/**
 * Function that
 * @returns {Logger}
 */
exports.getLogger = function() {
	var config = settings.getConfig(),
		category = exports.dereference(config.logging.appenders[0], 'category', 'dev');
	log4js.configure(config.logging, {});
	return log4js.getLogger(category);
};

/**
 * Jasmine does not natively support ability to stub getters and setters. We minimally
 * do what they do which is allow functionality to be dropped in and allow things to
 * be restored, but the exception is if we try to attach restore to getter then getter
 * acts as a function and things get screwy.  So we add '_' suffix, hence to disconnect
 * the stub one should call: obj.[getter-name]_.restore()
 * @param obj
 * @param getter
 * @param callback
 */
exports.stubGetter = function(obj, getter, callback) {
	var oldCallback = obj.__lookupGetter__(getter);
	obj[getter + '_'] = {
		restore: function() {
			obj.__defineGetter__(getter, oldCallback);
		}
	};
	obj.__defineGetter__(getter, callback);
};

/**
 * Generates a unique id based on timestamp.
 * @returns {*}
 * @private
 */
exports.generateId = function() {
	return uuid.v1();
};

/**
 * Returns current date
 * @returns {Date}
 */
exports.getCurrentDate = function() {
	return new Date();
};

/**
 * Reads the json file from a given path and returns the JSON in it
 * @param path
 * @returns {JSON}
 */
exports.readJSON = function(path) {
	var buffer = fs.readFileSync(path);
	return JSON.parse(buffer.toString());
};