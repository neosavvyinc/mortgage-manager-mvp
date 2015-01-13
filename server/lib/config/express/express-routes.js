'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	routeLogin = require('../../routes/route-loginOrRegister');

module.exports = function(app, passport) {
	//Healthcheck
	app.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	app.post('/login', routeLogin.validateLogin(passport));
};
