'use strict';

var schedule = require('node-schedule'),
    async = require('async'),
    mandrillTasks = require('./mandrill'),
    UserModel = require('./db/models/model-user').Model,
    UserDetailsModel = require('./db/models/model-user-details').Model;

/*
 [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
 */
var settings = {
    borrowerDigestTimer: '0 20 * * * *', // Every day at 8pm
    lenderDigestTimer: '0 20 * * * *' // Every day at 8pm
};

var borrowerDigest = function(done){
    schedule.scheduleJob(settings.borrowerDigestTimer, function(){

        var users;
        var User = new UserModel();
        var UserDetails = new UserDetailsModel();

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
                        var userInfo;
                        async.series([
                            function(userCallback){

                                UserDetails.retrieve({_id: user.toObject()._id}, function(userDetailsData){
                                    userInfo = userDetailsData.length ? userDetailsData[0].toObject() : userCallback(new Error('User doesn\'t have details'));
                                    userCallback();
                                }, userCallback);
                            },
                            function(userCallback){
                                mandrillTasks.sendBorrowerDigest(user.email, userInfo, userCallback);
                            }
                        ],function(error){
                            cb(error);
                        });
                    },
                    function(error){
                        if(error){
                            callback(error);
                        }
                    });

            }
        ],done);
    });
};

var lenderDigest = function(done){
    schedule.scheduleJob(settings.lenderDigestTimer, function(){
        var users;

        async.series([
            function(callback){
                var User = new UserModel();

                User.retrieve({type: 'lender'}, function(userData){
                    users = userData;
                    callback();
                }, callback);

            },
            function(callback){
                async.each(users,
                    function(user, cb){
                        var userInfo;
                        async.series([
                            function(userCallback){
                                var UserDetails = new UserDetailsModel();

                                UserDetails.retrieve({_id: user.toObject()._id}, function(userDetailsData){
                                    userInfo = userDetailsData.length ? userDetailsData[0].toObject() : userCallback(new Error('User doesn\'t have details'));;
                                    userCallback();
                                }, userCallback);
                            },
                            function(userCallback){
                                mandrillTasks.sendLenderDigest(user.email, userInfo, userCallback);
                            }
                        ],function(error){
                            cb(error);
                        });
                    },
                    function(error){
                        if(error){
                            callback(error);
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
            //log(error);
        }
    });

};