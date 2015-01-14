'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	routeLogin = require('../../routes/route-auth');

module.exports = function(app, passport) {
	//Healthcheck
	app.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	//Validate User Login
	app.route('/login')
		.post(routeLogin.validateLogin(passport));

	//Validate User Login
	app.route('/register')
		.post(routeLogin.validateLogin(passport));

	//
	app.route('/user/:uid')
		.post(routeLogin.validateLogin(passport));
};
