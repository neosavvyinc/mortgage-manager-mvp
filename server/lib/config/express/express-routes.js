'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	authRoute = require('../../routes/route-auth'),
	userRoute = require('../../routes/route-user-details');

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

	//Update a user based on a userId
	app.route('/user/:uid')
		.all(_isAuthenticated)
		.post(userRoute.updateUser);

	//Add a coapplicant for a particular userId
	app.route('/user/:uid/coapplicant')
		.all(_isAuthenticated)
		.post(userRoute.addCoApplicant);
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