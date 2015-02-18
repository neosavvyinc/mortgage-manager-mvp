'use strict';

var handlebars = require('handlebars'),
	log4js = require('log4js'),
	uuid = require('node-uuid'),
	settings = require('../config/app/settings'),
	fs = require('fs'),
	mv = require('mv'),
	os = require('os'),
	path = require('path'),
	util = require('util'),
	mkdirp = require('mkdirp'),
	_templateCache={};

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
		category = exports.dereference(config.logging.appenders[0], 'category', 'dev'),
		type = exports.dereference(config.logging.appenders[0], 'type', 'console'),
		isAbsolute = exports.dereference(config.logging.appenders[0], 'absolute', false),
		filename;

	if( isAbsolute ) {
		var absoluteLogPath = path.dirname(config.logging.appenders[0].filename);
		mkdirp.sync(absoluteLogPath);
	}
	else if(type === 'file') {
		var logPath = path.resolve(__dirname.split('lib')[0], '../mam-nginx/logs/');
		mkdirp.sync(logPath);
		filename = exports.dereference(config.logging.appenders[0], 'filename', 'prod.log');

		//Set the log file path to the absolute path
		config.logging.appenders[0].filename = path.join(__dirname.split('lib')[0], filename);
	}
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

/**
 * Transfers files from source to destination
 * @param source
 * @param dest
 */
exports.moveFiles = function(source, dest) {
	mv(source, dest, {mkdirp: true}, function(err) {
		if(err) {
			console.log('Error moving files '+ err);
		}
	});
};

/**
 * Renders markup using specified template and context
 * @param {String} path
 * @param context properties for binding in template
 * @returns {String}
 */
exports.renderTemplate = function(path, context) {
	var template, renderer;
	try {
		renderer = _templateCache[path];
		if(renderer === undefined) {
			template = fs.readFileSync(path, 'utf8');
			renderer = _templateCache[path] = handlebars.compile(template);
		}
		return renderer(context);
	} catch(e) {
		console.error('template.renderPath:: attempt to load and render \'%s\' failed: %s', path, e);
		throw e;
	}
};

/**
 * Works with 'os' to find temporary directory and finds a unique filename within. The reason
 * it is private is because the filename is not guaranteed to remain unique until it physically
 * exists in the filesystem. We leave it to local brains to make sure the path is used immediately
 * @private
 */
exports.getTmpFilePath = function(prefix, extension) {
	var index, _path;
	for(index=0; true; index++) {
		_path = path.join(os.tmpdir(), util.format('%s-%d.%s', prefix, index, extension));
		if(fs.existsSync(_path) === false) {
			break;
		}
	}
	return _path;
};

/**
 * Creates a temporary file and writes data to it using fs.writeFileSync
 * @param data
 * @param {String} extension - file extension
 * @param {Object} options (optional)
 * @returns {{path: {String}, error:{Error}}}
 */
exports.writeTmpFileSync = function(data, extension, options) {
	var tmpPath = exports.getTmpFilePath('MAM', extension),
		result = {};
	try {
		fs.writeFileSync(tmpPath, data, options);
		result.path = tmpPath;
	} catch(error) {
		console.error('file.writeFileSync: attempt to write \'%s\' failed: %s', path, error);
		result.error = error;
	}
	return result;
};

exports.deleteFileSync = function(path) {
	try {
		fs.unlinkSync(path);
	} catch(error) {
		console.error('file.delete: attempt to delete \'%s\' failed: %s', path, error);
	}
};