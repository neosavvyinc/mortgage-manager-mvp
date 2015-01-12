'use strict';

var path = require('path'),
	fs = require('fs'),
	async = require('async'),
	express = require('express'),
	settings = require('./config/app/settings'),
	app = express(),
	middleware = require('./config/express/express-middleware'),
	routes = require('./config/express/express-routes'),
	loginRoute = require('./routes/route-loginOrRegister'),
	passport = require('passport/'),
	server, log;

// Configure routes
routes(app);

// Configure middleware
middleware(app, passport);

//app.set('view engine', null);

/**
 * Listens on a port
 */
exports.listen = function () {
	server = app.listen.apply(app, arguments);
};

/**
 * Function to load the config
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
		loginRoute.initPassport(passport);
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