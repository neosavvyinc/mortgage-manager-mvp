'use strict';

var routeHealthcheck = require('../../routes/route-diagnostics'),
	authRoute = require('../../routes/route-user'),
	userRoute = require('../../routes/route-user-details'),
	documentRoute = require('../../routes/route-document'),
	applicationRoute = require('../../routes/route-application');

module.exports = function(router, passport) {
	//Healthcheck
	router.route('/healthcheck')
		.get(routeHealthcheck.healthCheck);

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
		.get(applicationRoute.getApplicationDocuments)
	        .post(documentRoute.insertDocument);

	router.route('/applications/:appId/lenders')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationLenders)
		.post(applicationRoute.inviteLenderToApplication);

    router.route('/applications/:appId/lenders/resend-invite')
        .all(_isAuthenticated)
        .post(applicationRoute.reSendLenderInvite);

	router.route('/applications/:appId/borrowers')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationBorrowers);

	//Route for handling one specific document in an application
	router.route('/applications/:appId/documents/:docId')
		.all(_isAuthenticated)
		.get(applicationRoute.getApplicationDocument)
		.post(documentRoute.insertDocument);

	//Route for getting one file
	router.route('/applications/:appId/file/:docId')
		.all(_isAuthenticated)
		.get(applicationRoute.getFile);

	//Route for downloading file
	router.route('/applications/:appId/download/:docId')
		.all(_isAuthenticated)
		.get(applicationRoute.downloadFile);

	//Route for creating a new document entry
	router.route('/applications/:appId/documentEntry')
		.all(_isAuthenticated)
		.post(documentRoute.insertDocumentEntry);
};

/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @private
 */
var _isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		next();
	} else {
		res.status(401).end();
	}
};
