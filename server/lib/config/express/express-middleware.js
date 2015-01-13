'use strict';
var expressSession = require('express-session'),
	bodyParser = require('body-parser');


module.exports = function(app, passport) {
	// for parsing application/json
	app.use(bodyParser.json());

	// for parsing application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// For passport
	app.use(expressSession({
		secret: 'mySecretKey',
		saveUninitialized: true,
		resave: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	// Forward 404 to Error handler
	app.use(function(req, res, next) {
		var error = new Error('Route not handled');
		error.status = 404;
		next(error);
	});
};
