'use strict';

var log4js = require('log4js'),
	config = require('../config/settings').getConfig(),
	path = require('path');

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
	var category = exports.dereference(config.logging.appenders[0], 'category', 'dev');
	log4js.configure(config.logging, {});
	return log4js.getLogger(category);
};

