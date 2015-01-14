'use strict';
var expressSession = require('express-session'),
	bodyParser = require('body-parser'),
	settings = require('../app/settings');


module.exports = function(app, passport) {
	// for parsing application/json
	app.use(bodyParser.json());

	// for parsing application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// For passport
	app.use(expressSession({
		secret: settings.secretKey,
		saveUninitialized: true,
		resave: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());
};

/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @private
 */
var _isAuthenticated = function(req, res, next){
	if(req.sessionID){
		next();
	} else {
		res.status(401).end();
	}
};
