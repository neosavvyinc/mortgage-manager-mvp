'use strict';

var errorUtils = require('../../utils/error-utils'),
	dbInsert = require('./db-insert'),
	settings = require('../../config/app/settings'),
	async = require('async'),
	path = require('path'),
	fs = require('fs');

var _parseCommand = function() {
	if(process.argv.length > 3) {
		throw new Error('Process should have only 3 arguments');
	} else {
		return process.argv[2];
	}
};

var _runCommand = function(command, success, failure) {
	var dbUrl = settings.getConfig().dbURL,
		db = new dbInsert.Db(dbUrl);
	if(command === 'create') {
		db.run(success, failure);
	} else {
		failure(new Error('Command '+command+ ' not found.'));
	}
};

/**
 * Construct the json file name and return the json config
 * @return{JSON}
 */
var loadConfig = function() {
	var env = process.env.NODE_ENV || 'development',
		rootPath = __dirname.split('server')[0],
		configPath = path.resolve(rootPath + '/server/config'),
		configFile = path.join(configPath + '/', env + '.json'),
		config = fs.readFileSync(configFile, 'utf8');
	settings.setConfig(config);
};

errorUtils.handleErrors(
	function() {
		var command;
		async.series([
			function(done) {
				loadConfig();
				done();
			},
			function(done) {
				command = _parseCommand();
				done();
			},
			function(done) {
				_runCommand(command,
					function() {
						process.exit();
					},
					function(error) {
						done(error);
					});
				done();
			}
		],
		function(error) {
			if(error !== undefined) {
				throw error;
			}
		});
	},
	function(error) {
		if(error) {
			console.log(error.message);
		}
	});