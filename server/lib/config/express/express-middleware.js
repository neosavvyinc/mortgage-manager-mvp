'use strict';

var path = require('path'),
	expressSession = require('express-session'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	settings = require('../app/settings');

module.exports = function(app, router, passport) {
	// for parsing application/json
	app.use(bodyParser.json({limit: '5mb'}));

	// for parsing application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// for parsing multipart data
	app.use(multer({
		dest: path.resolve(__dirname, '../../../uploads'),
		limits: {
			fileSize: 25 * 1024 * 1024
		},
		onFileUploadStart: function (file) {
			var extension = file.extension;
			if (extension!=='pdf' && extension!=='jpg' && extension!=='jpeg' && extension!=='png') {
				return false;
			}
		}
	}));

	// For passport
	app.use(expressSession({
		secret: settings.secretKey,
		saveUninitialized: true,
		resave: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/api', router);

};

