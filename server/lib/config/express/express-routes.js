'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	routeLogin = require('../../routes/route-loginOrRegister');

module.exports = function(app, passport) {
	//Healthcheck
	app.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	//Validate User Login
	app.post('/login', routeLogin.validateLogin(passport));
};
