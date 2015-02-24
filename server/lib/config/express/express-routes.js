'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	authRoute = require('../../routes/route-user'),
	userRoute = require('../../routes/route-user-details'),
	documentRoute = require('../../routes/route-document'),
	applicationRoute = require('../../routes/route-application'),
	paymentRoute = require('../../routes/route-payment'),
	userService = require('../../services/service-user'),
	settings = require('../app/settings');

module.exports = function(router, passport, s3Client) {
	//Healthcheck
	router.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

	router.route('/user')
		.all(_isAuthenticated)
		
		.get(function(req, res) {
			res.send(req.user).end();
		});

	//Validate User Login
	router.route('/login')
		.post(authRoute.validateLogin(passport));

	router.route('/login/token')
		.post(authRoute.AddAppAndLogin(passport));

    router.route('/logout')
        .post(authRoute.userLogOut);

    router.route('/is-authenticated')
        .post(authRoute.isAuthenticated);

	//Create a new user
	router.route('/register')
		.post(authRoute.registerUser(passport));

	//Check if email exists
	router.route('/email-exists')
		.post(authRoute.emailExists);

	//Forgot password
	router.route('/forgot-password')
		.post(authRoute.forgotPassword);

	//Update a user based on a userId
	router.route('/user/:uid')
		.all(_isAuthenticated)
		.get(userRoute.getUserDetails)
		.post(userRoute.updateUser);

	router.route('/user/:uid/checkTrialExpired')
		.all(_isAuthenticated)
		.get(authRoute.checkTrialExpired);

	//Update password
	router.route('/user/:uid/update-password')
		.post(authRoute.updatePassword);

	//Add a coapplicant for a particular userId
	router.route('/user/:uid/coapplicant')
		.all(_isAuthenticated)
		.post(userRoute.addCoApplicant);

	//Create application for a particular userId
	router.route('/user/:uid/applications')
		.all(_isAuthenticated)
		.post(applicationRoute.createApplication)
		.get(applicationRoute.getAllApplications);

	//Manage application specific documents
	router.route('/applications/:appId/documents')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationDocuments);

	router.route('/applications/:appId/lenders')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationLenders)
		.post(applicationRoute.inviteLenderToApplication);

    router.route('/applications/:appId/lenders/resend-invite')
        .all(_isAuthenticated)
        .post(applicationRoute.reSendLenderInvite);

    router.route('/applications/:appId/lenders/uninvite')
        .all(_isAuthenticated)
        .post(applicationRoute.deleteInvite);

	router.route('/applications/:appId/borrowers')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationBorrowers);

	//Route for downloading all documents in an application
	router.route('/applications/:appId/download')
		.all(_isAuthenticated)
		.all(_checkTrialExpired)
		.get(documentRoute.downloadAllDocuments);

	//Route for handling one specific document in an application
	router.route('/applications/:appId/documents/:docId')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationDocument);

	//Route for one file to view/upload
	router.route('/applications/:appId/file/:docId')
		.all(_isAuthenticated)
		.all(_checkTrialExpired)
		.post(documentRoute.insertDocument(s3Client))
		.get(applicationRoute.getFile);

	//Route for downloading file
	router.route('/applications/:appId/download/:docId')
		.all(_isAuthenticated)
		.all(_checkTrialExpired)
		.get(applicationRoute.downloadFile);

	//Route for creating a new document entry
	router.route('/applications/:appId/documentEntry')
		.all(_isAuthenticated)
		.post(documentRoute.insertDocumentEntry);

	router.route('/payment/:token')
		.post(paymentRoute.makePayment);

	router.route('/payment/publishableKey')
		.get(paymentRoute.getPublishableKey);
};

/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @private
 */
var _isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};

/**
 * Check if user has access to premium features
 * @param req
 * @param res
 * @param next
 * @private
 */
var _checkTrialExpired = function(req, res, next) {
	userService.checkTrialExpired(req.user._id, function() {
		//Success callback if trail has not expired.
		//Allow express to handle the next request.
		next();
	}, function(error) {
		if(error.message === 'Trial Expired') {
			res.status(405).send({message: error.message});
		} else {
			res.status(500).send({message: 'Internal Server Error'});
		}
		settings.log.error(error.message);
	});
};