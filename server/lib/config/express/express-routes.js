'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	authRoute = require('../../routes/route-user'),
	userRoute = require('../../routes/route-user-details');

module.exports = function(router, passport) {
	//Healthcheck
	router.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	//Validate User Login
	router.route('/login')
		.post(authRoute.validateLogin(passport));

	//Create a new user
	router.route('/register')
		.post(authRoute.registerUser(passport));

	//Update a user based on a userId
	router.route('/user/:uid')
		.all(_isAuthenticated)
		.post(userRoute.updateUser);

	//Add a coapplicant for a particular userId
	router.route('/user/:uid/coapplicant')
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