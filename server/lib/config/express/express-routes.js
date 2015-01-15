'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	authRoute = require('../../routes/route-auth');

module.exports = function(app, passport) {
	//Healthcheck
	app.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	//Validate User Login
	app.route('/login')
		.post(authRoute.validateLogin(passport));

	//Create a new user
	app.route('/register')
		.post(authRoute.registerUser(passport));

	app.route('/user/:uid')
		.all(_isAuthenticated);

	app.route('/user/:uid/coapplicant')
		.all(_isAuthenticated);
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