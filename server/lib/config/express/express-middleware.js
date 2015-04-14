'use strict';

var path = require('path'),
	expressSession = require('express-session'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	settings = require('../app/settings'),
    _ = require('underscore');

var validFileExtensions = [
    'pdf',
    'jpg',
    'jpeg',
    'png',
    'gif'
];

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
            if( !extension || !_.contains(validFileExtensions, extension.toLowerCase()) ) {
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

