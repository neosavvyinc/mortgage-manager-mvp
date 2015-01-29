'use strict';

var async = require('async');
var _ = require('underscore');
var applicationModel = require('../db/models/model-application').Model;
var userDetailsModel = require('../db/models/model-user-details').Model;
var userModel = require('../db/models/model-user').Model;
var documentModel = require('../db/models/model-document').Model;
var applicationLendersModel = require('../db/models/model-application-lenders').Model;
var applicationService = require('./service-application');
var documentService = require('./service-document');

exports.getUserApplications = function(uid, success, failure){
    var application = new applicationModel();
    var applicationLenders = new applicationLendersModel();
    var userDetails = new userDetailsModel();
    var user = new userModel();

    var userType,
        applications = [];

    async.series([
        /*
            Get type of the user requesting all applications
         */
        function(done){
            user.retrieve({_id: uid}, function(userData){
                if(userData[0].toObject !== undefined ) {
                    userType = userData[0].toObject().type;
                }
                done();
            }, function(error){
                done(error);
            });
        },
        /*
            If the user is a borrower, retrieve all user's applications
            If the user is a lender, search for all the appIDs related to that lender in the ApplicationLender Table
         */
        function(done){
            if(userType === 'borrower'){
                application.retrieve({pUID: uid}, function(apps){
                    applications = apps;
                    done();
                }, function(error){
                    done(error);
                });
            } else if (userType === 'lender'){
                applicationLenders.retrieve({lenderId: uid}, function(applicationLenderData){
                    async.each(applicationLenderData, function(appLenderData, callback){
                        application.retrieve({_id: appLenderData.appId}, function(app){
                            applications.push(app[0]);
                            callback();
                        }, callback);
                    }, function(error){
                        if(error){
                            done(error);
                        } else {
                            done();
                        }
                    });
                });
            } else {
                done(new Error('Internal Server Error'));
            }
        },
        /*
            If the user is a lender, load the user Details for the primary applicant and the coapplicant of each application related to that lender
         */
        function(done){
            if( userType === 'lender') {
                async.each(applications,
                    function (app, callback) {
                        async.parallel([
                                /*
                                    Get all primary user details
                                 */
                                function (cb) {
                                    userDetails.retrieve({_id: app.pUID}, function (userData) {
                                        _.extend(app, {
                                            primaryFirstName: userData[0].firstName,
                                            primaryLastName: userData[0].lastName
                                        });
                                        cb();
                                    }, cb);
                                },
                                /*
                                    Get all coapplicant user details if there are any
                                 */
                                function (cb) {
                                    if (app.coUID) {
                                        userDetails.retrieve({_id: app.coUID}, function (userData) {
                                            _.extend(app, {
                                                coappFirstName: userData[0].firstName,
                                                coappLastName: userData[0].lastName
                                            });
                                            cb();
                                        }, cb);
                                    } else {
                                        cb();
                                    }
                                }
                            ],
                            function (error) {
                                if (error) {
                                    callback(error);
                                } else {
                                    callback();
                                }
                            });
                    },
                    function (error) {
                        if (error) {
                            done(error);
                        } else {
                            done();
                        }
                    }
                );
            } else {
                done();
            }
        }
    ], function (error){
        if(error){
            failure(error);
        } else {
            success(applications);
        }
    });
};

exports.createApplication = function(uid, callback) {

    var userDetails = new userDetailsModel();
    var application = new applicationModel();
    var documents = new documentModel();

    var applicantDetails,
        coapplicantDetails = null,
        docs,
        applicationId;

    async.series([
        function(done){
            userDetails.retrieve({_id: uid}, function(bDetails){
                applicantDetails = bDetails[0];
                done();
            }, function(error){
                callback(error);
            });
        },
        function(done){
            if(applicantDetails.coUID){
                userDetails.retrieve({_id: applicantDetails.coUID}, function (coAppDetails) {
                    coapplicantDetails = coAppDetails[0];
                    done();
                }, done);
            } else {
                done();
            }
        },
        function(done) {
            application.insertNewApp(applicantDetails, coapplicantDetails, function(appUUID){
                applicationId = appUUID;
                done();
            }, done);
        },
        function(done) {
            docs = documentService.generateDocumentList(applicationId, applicantDetails, coapplicantDetails);
            documents.insertNewDocument(docs, done, done);
        },
        function(done){
            applicationService.insertDocuments(docs, done, done);
        }
    ], function(error){
            if(error !== undefined){
                callback(error);
            } else {
                callback(null, null);
            }
        }
    );
};

exports.insertDocuments = function(documents, callback){
    var application = new applicationModel();

    if(!documents[0] || documents[0].appId){
        callback(new Error('The document array was empty'));
    }
    application.update({documents: _.pluck(documents, '_id')}, {_id: documents[0].appId}, callback, callback);
};

exports.getDocuments = function(appId, docId, success, failure){
    var documents = new documentModel(),
        conditions = {appId: appId};

    if(docId) {
        conditions._id = docId;
    }

    documents.retrieve(conditions, success, failure);
};