
'use strict';

var path = require('path'),
	fs = require('fs'),
	async = require('async'),
	express = require('express'),
	settings = require('./config/settings'),
	app = express(),
	routeHealthcheck = require('./routes/route-diagnostics'),
	server, log;

exports.listen = function () {
	server = app.listen.apply(app, arguments);
};

/**
 * Function that loads the config
 */
var loadConfig = function() {
	var env = process.env.NODE_ENV || 'development',
		rootPath = __dirname.split('server')[0],
		configPath = path.resolve(rootPath + '/server/config'),
		configFile = path.join(configPath + '/', env + '.json'),
		config = fs.readFileSync(configFile, 'utf8');
	settings.setConfig(config);
};

/**
 * Function that starts the server and listens on a port.
 */
var runServer = function() {
	var port = settings.getConfig().port;

	//Start listening on localhost
	exports.listen(port);
	log.info('Node app listening on port %d', port);
};

/** Routes */
app.get('/healthcheck', routeHealthcheck.healthCheck);

/**
 * Block that runs when this script is executed.
 */
async.series([
	function(done) {
		loadConfig();
		done();
	},
	function(done) {
		log = require('./utils/commonUtils').getLogger();
		done();
	},
	function(done) {
		runServer();
		done();
	}
], function(error) {
	if(error !== undefined) {
		log.fatal(error);
	}
});