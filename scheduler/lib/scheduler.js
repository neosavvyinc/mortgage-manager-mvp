'use strict';

var schedule = require('node-schedule'),
    async = require('async'),
    mandrillTasks = require('./mandrill'),
    UserModel = require('./db/models/model-user').Model,
    UserDetailsModel = require('./db/models/model-user-details').Model,
    ApplicationModel = require('./db/models/model-application').Model,
    DocumentModel = require('./db/models/model-document').Model;

/**
 * Add the interval in which you want to send the emails to the following object
 * [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
 */
var settings = {
    borrowerDigestTimer: '0 9 ? * 5', // Fridays at 9am
    lenderDigestTimer: '0 9 ? * 5' // Fridays at 9am
};

/**
 * [
 *  {
 *      rcpt: EMAIL,
 *      vars: [
 *          {
 *              name: NAME_HANDLEBARS,
 *              content: CONTENT_OF_VAR
 *          }
 *      ]
 *  }
 * ]
 */


var borrowerDigest = function(done){
    schedule.scheduleJob(settings.borrowerDigestTimer, function(){

        var users, recipients = [];
        var User = new UserModel(),
            UserDetails = new UserDetailsModel(),
            Application = new ApplicationModel(),
            Document = new DocumentModel();

        var borrowersInfo = [];

        async.series([
            function(callback){

                User.retrieve({type: 'borrower'}, function(userData){
                    users = userData;
                    callback();
                }, callback);

            },
            function(callback){

                async.each(users,
                    function(user, cb){
                        var userInfo = {
                            rcpt: null,
                            vars: []
                        };

                        /**
                         * USER:
                         *  - Email
                         */
                        userInfo.rcpt = user.email;

                        async.waterfall([

                            /**
                             * USER DETAILS:
                             *  - Borrower First Name
                             *  - Borrower Last Name
                             *
                             *  callback => User Application IDs
                             */
                            function(userCallback){
                                UserDetails.retrieve({_id: user._id}, function(userDetailsData){
                                    if(userDetailsData && userDetailsData.length){
                                        userInfo.vars.push({
                                            name: 'borrowerFirstName',
                                            content: userDetailsData[0].toObject().firstName
                                        });
                                        userInfo.vars.push({
                                            name: 'borrowerLastName',
                                            content: userDetailsData[0].toObject().lastName
                                        });
                                        recipients.push({
                                            email: user.email,
                                            name: userDetailsData[0].toObject().firstName + ' ' + userDetailsData[0].toObject().lastName
                                        });
                                        userCallback(null, userDetailsData[0].toObject().appId);
                                    } else {
                                        userCallback();
                                    }
                                }, userCallback);
                            },

                            /**
                             * APPLICATION
                             *  - Application ID or Name
                             *
                             *  callback => Application Document IDs
                             */
                            function(userAppIds, userCallback){
                                if(userAppIds && userAppIds.length){
                                    var applications = [];
                                    async.each(userAppIds,
                                        function(appId, cback){
                                            var application = {};
                                            Application.retrieve({_id:appId}, function(app){
                                                if(app && app.length){
                                                    application.name = appId;
                                                    application.docIds = app[0].toObject().documents;
                                                    applications.push(application);
                                                    cback();
                                                } else {
                                                    cback(new Error("Empty"));
                                                }
                                            }, cback);
                                        }, function(error){
                                            if(error){
                                                userCallback(error);
                                            } else {
                                                userCallback(null, applications);
                                            }
                                        });
                                } else {
                                    userCallback();
                                }
                            },

                            /**
                             * DOCUMENT
                             *  - Document Name
                             *  - Document Description
                             *  - Modified Date
                             *  - Action Required
                             */
                            function(applications, userCallback){
                                if(applications && applications.length){

                                    async.each(applications,
                                        function(app, cback){
                                            app.documents = [];
                                            async.each(app.docIds,
                                                function(docId, callbk){
                                                    var doc = {};
                                                    Document.retrieve({_id: docId}, function(docData){
                                                        if(docData){
                                                            doc.name = docData[0].toObject().name;
                                                            doc.description = docData[0].toObject().description;
                                                            doc.type = docData[0].toObject().type;
                                                            app.documents.push(doc);
                                                            callbk();
                                                        } else {
                                                            callbk();
                                                        }
                                                    }, callbk);
                                                },
                                                function(error){
                                                    if(error){
                                                        cback(error);
                                                    } else {
                                                        delete app.docIds;
                                                        userInfo.vars.push({
                                                            name: 'applicationData',
                                                            content: app
                                                        });
                                                        cback();
                                                    }
                                                });

                                        },
                                        function(error) {
                                            if(error){
                                                userCallback(error);
                                            } else {
                                                userCallback();
                                            }
                                        }
                                    );
                                } else {
                                    userCallback();
                                }
                            }

                        ],function(error){
                            if(error){
                                cb();
                            } else {
                                borrowersInfo.push(userInfo);
                                cb();
                            }
                        });
                    },
                    function(error){
                        if(error){
                            callback(error);
                        } else {
                            mandrillTasks.sendBorrowerDigest(recipients, borrowersInfo, callback);
                        }
                    });

            }
        ],done);
    });
};

//var lenderDigest = function(done){
//    schedule.scheduleJob(settings.lenderDigestTimer, function(){
//        var users;
//
//        async.series([
//            function(callback){
//                var User = new UserModel();
//
//                User.retrieve({type: 'lender'}, function(userData){
//                    users = userData;
//                    callback();
//                }, callback);
//
//            },
//            function(callback){
//                async.each(users,
//                    function(user, cb){
//                        var userInfo;
//                        async.series([
//                            function(userCallback){
//                                var UserDetails = new UserDetailsModel();
//
//                                UserDetails.retrieve({_id: user.toObject()._id}, function(userDetailsData){
//                                    userInfo = userDetailsData.length ? userDetailsData[0].toObject() : userCallback(new Error('User doesn\'t have details'));
//                                    userCallback();
//                                }, userCallback);
//                            },
//                            function(userCallback){
//                                mandrillTasks.sendLenderDigest(user.email, userInfo, userCallback);
//                            }
//                        ],function(error){
//                            cb(error);
//                        });
//                    },
//                    function(error){
//                        if(error){
//                            callback(error);
//                        }
//                    });
//
//            }
//        ],done);
//    });
//};


exports.initScheduler = function(){

    async.parallel([
            borrowerDigest
        ],
    function(error){
        if(error){
            //log(error);
        }
    });

};