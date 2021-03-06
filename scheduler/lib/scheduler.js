'use strict';

var schedule = require('node-schedule'),
    async = require('async'),
    mandrillTasks = require('./mandrill'),
    UserModel = require('./db/models/model-user').Model,
    UserDetailsModel = require('./db/models/model-user-details').Model,
    ApplicationModel = require('./db/models/model-application').Model,
    ApplicationLendersModel = require('./db/models/model-application-lenders').Model,
    DocumentModel = require('./db/models/model-document').Model,
    settings = require('./config/settings');

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
                                    var apps = [];
                                    async.each(applications,
                                        function(app, cback){
                                            var today = new Date();
                                            var newApp = {
                                                name: app.name,
                                                documentsCount: 0,
                                                newDocuments: 0
                                            };
                                            async.each(app.docIds,
                                                function(docId, callbk){
                                                    Document.retrieve({_id: docId}, function(docData){
                                                        if(docData && !docData[0].url){
                                                            if(today - docData[0].requestDate < 604800000){
                                                                newApp.newDocuments++;
                                                            } else {
                                                                newApp.documentsCount++;
                                                            }
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
                                                        apps.push(newApp);
                                                        cback();
                                                    }
                                                });

                                        },
                                        function(error) {
                                            if(error){
                                                userCallback(error);
                                            } else {
                                                userInfo.vars.push({
                                                    name: 'applicationData',
                                                    content: apps
                                                });
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

var lenderDigest = function(done){
    schedule.scheduleJob(settings.lenderDigestTimer, function(){

        var users, recipients = [];
        var User = new UserModel(),
            UserDetails = new UserDetailsModel(),
            ApplicationLenders = new ApplicationLendersModel(),
            Application = new ApplicationModel(),
            Document = new DocumentModel();

        var borrowersInfo = [];

        async.series([
            function(callback){

                User.retrieve({type: 'lender'}, function(userData){
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
                                            name: 'lenderFirstName',
                                            content: userDetailsData[0].toObject().firstName
                                        });
                                        userInfo.vars.push({
                                            name: 'lenderLastName',
                                            content: userDetailsData[0].toObject().lastName
                                        });
                                        recipients.push({
                                            email: user.email,
                                            name: userDetailsData[0].toObject().firstName + ' ' + userDetailsData[0].toObject().lastName
                                        });
                                        userCallback(null);
                                    } else {
                                        userCallback();
                                    }
                                }, userCallback);
                            },

                        /**
                         * APPLICATION LENDERS
                         * - Application IDs
                         */
                            function(userCallback){
                            ApplicationLenders.retrieve({lenderId: user._id},
                                function(userAppLender){
                                    if(userAppLender && userAppLender.length){
                                        userCallback(null, userAppLender[0].appId);

                                    } else {
                                        userCallback();
                                    }
                                },userCallback);
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
                                    var apps = [];
                                    async.each(applications,
                                        function(app, cback){
                                            var today = new Date();
                                            var newApp = {
                                                name: app.name,
                                                documentsCount: 0,
                                                newDocuments: 0
                                            };
                                            async.each(app.docIds,
                                                function(docId, callbk){
                                                    Document.retrieve({_id: docId}, function(docData){
                                                        if(docData && docData[0].url){
                                                            if(today - docData[0].uploadDate < 604800000){
                                                                newApp.newDocuments++;
                                                            } else {
                                                                newApp.documentsCount++;
                                                            }
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
                                                        apps.push(newApp);
                                                        cback();
                                                    }
                                                });

                                        },
                                        function(error) {
                                            if(error){
                                                userCallback(error);
                                            } else {
                                                userInfo.vars.push({
                                                    name: 'applicationData',
                                                    content: apps
                                                });
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


exports.initScheduler = function(){
    async.parallel([
            borrowerDigest,
            lenderDigest
        ],
    function(error){
        if(error){
            settings.log.fatal(error);
        }
    });
};