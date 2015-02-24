'use strict';

var async = require('async');
var _ = require('underscore');
var commonUtils = require('../utils/common-utils');
var applicationModel = require('../db/models/model-application').Model;
var userDetailsModel = require('../db/models/model-user-details').Model;
var userModel = require('../db/models/model-user').Model;
var documentModel = require('../db/models/model-document').Model;
var applicationLendersModel = require('../db/models/model-application-lenders').Model;
var lenderInvitesModel = require('../db/models/model-lender-invites').Model;
var applicationService = require('./service-application');
var documentService = require('./service-document');
var mandrillService = require('./service-mandrill');

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
                if(userData[0] && userData[0].toObject !== undefined ) {
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
            if(userType === 'borrower') {
	            //Borrower can either be an applicant or coapplicant
                application.retrieve({pUID: uid}, function(apps) {
	                if(apps.length > 0) {
		                applications = apps;
		                done();
	                } else {
		                //For borrower as coapplicant
		                application.retrieve({coUID: uid}, function(apps) {
			                applications = apps;
			                done();
		                }, done);
	                }
                }, done);
            } else if (userType === 'lender') {
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
                async.map(applications,
                    function (app, callback) {
                        var usersInfo = {};
                        if(app){
                            async.parallel([
                                /*
                                    Get all primary user details
                                 */
                                function (cb) {
                                    userDetails.retrieve({_id: app.pUID}, function (userData) {
                                        usersInfo.primaryFirstName = userData[0].firstName;
                                        usersInfo.primaryLastName = userData[0].lastName;
                                        cb();
                                    }, cb);
                                },
                                /*
                                    Get all coapplicant user details if there are any
                                 */
                                function (cb) {
                                    if (app.coUID) {
                                        userDetails.retrieve({_id: app.coUID}, function (userData) {
                                            usersInfo.coappFirstName = userData[0].firstName;
                                            usersInfo.coappLastName = userData[0].lastName;
                                            cb();
                                        }, cb);
                                    } else {
                                        cb();
                                    }
                                }
                            ],
                            function (error) {
                                if (error) {
                                    callback(error, null);
                                } else {
                                    _.extend(app._doc, usersInfo);
                                    callback(null, app);
                                }
                            });
                        } else {
                            callback();
                        }
                    },
                    function (error, apps) {
                        if (error) {
                            done(error, null);
                        } else {
                            applications = apps;
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

exports.createApplication = function(uid, success, failure) {

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
                done(error);
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
                failure(error);
            } else {
                success(applicationId);
            }
        }
    );
};

exports.insertDocuments = function(documents, success, failure){
    var application = new applicationModel();

    if(documents.length < 1){
        failure(new Error('The document array was empty'));
    }
    application.update({documents: _.pluck(documents, '_id')}, {_id: documents[0].appId}, success, failure);
};

exports.getDocuments = function(appId, docId, success, failure){
    var documents = new documentModel(),
        conditions = {appId: appId};

    if(docId) {
        conditions._id = docId;
    }

    documents.retrieve(conditions, success, failure);
};

exports.getLenders = function(appId, success, failure){
    var applicationLenders = new applicationLendersModel();
    var userDetails = new userDetailsModel();
    var lenderInvites = new lenderInvitesModel();
    var user = new userModel();

    var lenderIds = [],
        lendersDetails = [];

    async.series([
        function(done){
            lenderInvites.retrieve({appId: appId}, function(invites){
                _.forEach(invites, function(invite){
                    if(invite.isOpen){
                        lendersDetails.push({
                            _id: invite._id,
                            email: invite.email,
                            firstName: invite.firstName,
                            lastName: invite.lastName,
                            organization: invite.organization,
                            status: 'Pending'
                        });
                    }
                });
                done();
            }, done);
        },
        function(done){
            applicationLenders.retrieve({appId: appId}, function(data){
                _.forEach(data, function(lender){
                    lenderIds.push(lender.lenderId);
                });
                done();
            }, done);
        },
        function(done){
            async.each(lenderIds, function(lenderId, cb){
                var newLenderInfo;
                async.series([
                    function(callback){
                        userDetails.retrieve({_id: lenderId}, function(lender){
                            newLenderInfo = _.extend(lender[0].toObject(), {
                                status: 'Accepted'
                            });
                            callback();
                        }, callback);
                    },
                    function(callback){
                        user.retrieve({_id: lenderId}, function(userBasic){
                            newLenderInfo.email = userBasic[0].email;
                            lendersDetails.push(newLenderInfo);
                            callback();
                        }, callback);
                    }
                ], function(error){
                    if(error){
                        cb(error);
                    } else {
                        cb();
                    }
                });
            }, function(error){
                if(error){
                    done(error);
                } else {
                    done();
                }
            });
        }
    ], function(error){
        if(error){
            failure(error);
        } else {
            success(lendersDetails);
        }
    });
};

exports.getBorrowers = function(appId, success, failure){
    var application = new applicationModel();
    var userDetails = new userDetailsModel();
    var user = new userModel();

    var borrowersDetails = [],
        appDetails;
    async.series([
        function(done){
            application.retrieve({_id: appId}, function(application){
                appDetails = application[0];
                done();
            }, done);
        },
        function(done){
            async.parallel([
                function(cb){
                    var applicant = {};
                    async.series([
                        function(callback){
                            userDetails.retrieve({_id: appDetails.pUID}, function(userData){
                                applicant = userData[0].toObject();
                                callback();
                            }, callback);
                        },
                        function(callback){
                            user.retrieve({_id: appDetails.pUID}, function(userData){
                                applicant.email = userData[0].email;
                                borrowersDetails.push(applicant);
                                callback();
                            }, callback);
                        }
                    ], function(error){
                        if(error){
                            cb(error);
                        } else {
                            cb();
                        }
                    });
                },
                function(cb){
                    if(appDetails.coUID){
                        var coapplicant = {};
                        async.series([
                            function(callback){
                                userDetails.retrieve({_id: appDetails.coUID}, function(userData){
                                    coapplicant = userData[0].toObject();
                                    callback();
                                }, callback);
                            },
                            function(callback){
                                user.retrieve({_id: appDetails.coUID}, function(userData){
                                    coapplicant.email = userData[0].email;
                                    borrowersDetails.push(coapplicant);
                                    callback();
                                }, callback);
                            }
                        ], function(error){
                            if(error){
                                cb(error);
                            } else {
                                cb();
                            }
                        });
                    } else {
                        cb();
                    }
                }
            ], function(error){
                if(error){
                    done(error);
                } else {
                    done();
                }
            });
        }
    ], function(error){
        if(error){
            failure(error);
        } else {
            success(borrowersDetails);
        }
    });

};

exports.inviteLender = function(appId, userId, lenderInfo, success, failure){

    var lenderInvites = new lenderInvitesModel();
    var userDetails = new userDetailsModel();

    var sender,
        token = commonUtils.generateId();

    async.series([
        function(done){
            userDetails.retrieve({_id: userId}, function(userInfo){
                if(userInfo[0].toObject !== undefined ) {
                    sender = userInfo[0].toObject();
                }
                done();
            }, done);
        },
        function(done){
            lenderInvites.retrieve({email: lenderInfo.email},function(lenderInviteData){
                if(lenderInviteData.length){
                    done({message:'User has already been invited to this application'});
                } else {
                    done();
                }
            });
        },
        function(done){
            mandrillService.sendInvite(lenderInfo, sender, appId, token, done);
        },
        function(done){
            _.extend(lenderInfo,{
                _id: commonUtils.generateId(),
                appId: appId,
                senderId: userId,
                token: token
            });

            lenderInvites.insert(lenderInfo, done, done);
        }
    ], function(error){
        if(error){
            failure(error);
        } else {
            success();
        }
    });
};

exports.reSendLenderInvitation = function(appId, inviteInfo, success, failure){

    var lenderInvites = new lenderInvitesModel();
    var userDetails = new userDetailsModel();

    var sender,
        token = commonUtils.generateId();

    async.series([
        function(done){
            userDetails.retrieve({_id: inviteInfo.senderId}, function(userInfo){
                if(userInfo[0].toObject !== undefined ) {
                    sender = userInfo[0].toObject();
                }
                done();
            }, done);
        },
        function(done){
            mandrillService.sendInvite(inviteInfo, sender, appId, token, done);
        },
        function(done){
            _.extend(inviteInfo, {
                token: token
            });

            lenderInvites.update(inviteInfo, { _id: inviteInfo._id }, done, done);
        }
    ], function(error){
        if(error){
            failure(error);
        } else {
            success();
        }
    });
};

exports.deleteInvitation = function(appId, inviteInfo, success, failure){
    var lenderInvites = new lenderInvitesModel();

    lenderInvites.remove(inviteInfo, success, failure);
};