'use strict';

var async = require('async'),
	_ = require('underscore'),
    passwordGenerator = require("password-generator"),
	userDetailsModel = require('../db/models/model-user-details').Model,
	userModel = require('../db/models/model-user').Model,
	lenderInvitesModel = require('../db/models/model-lender-invites').Model,
	applicationLendersModel = require('../db/models/model-application-lenders').Model,
    mandrillService = require('./service-mandrill');


/**
 * Function that updates a user in mongo
 * @param userObject - object with updated fields
 * @param success
 * @param failure
 */
exports.updateUser = function(userObject, success, failure) {
	var userDetails = new userDetailsModel(),
        user = new userModel(),
        lenderInvites = new lenderInvitesModel();

    async.series([
        function(done){
            async.series([
                function(cb){
                    userDetails.insertOrUpdate(userObject, cb, cb);
                },
                function(cb){
                    if(userObject.appId && userObject.appId.length){
                        async.parallel([
                            function(callback){
                                lenderInvites.update({isOpen: false}, {appId: userObject.appId[0]}, null, callback, callback);
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

        },
        function(done){
            user.update({hasUserDetails: true}, {_id:userObject._id}, done, done);
        }
    ], function(error){
        if(error){
            failure(error);
        } else {
            success();
        }
    });
};

/**
 * Function that creates a coapplicant for a particular user
 * @param userId
 * @param coapplicant
 * @param success
 * @param failure
 */
exports.createCoApplicant = function(userId, coapplicant, success, failure) {
	var createdCoApp,
        newPassword,
        user = new userModel(),
        userDetails = new userDetailsModel(),
        coAppEmail = coapplicant.email;
    async.series([
		function(done) {
			//Create coapplicant credentials in user schema
            newPassword = generatePassword();
			user.insertOrUpdate({
                email: coapplicant.email,
                password: newPassword,
                type: coapplicant.type
            }, {email: coapplicant.email}, function(coapp) {
				createdCoApp = coapp;
				done();
			}, done);
		},
        function(done) {
            mandrillService.sendPassword(coapplicant, newPassword, done);
        },
		function(done) {
			//Create coapplicant details in user details schema
			//Delete details from coapplicant that we don't want to persist in the user details schema
			delete coapplicant.email;
			delete coapplicant.password;
			delete coapplicant.type;

			coapplicant._id = createdCoApp._id;

			userDetails.insertOrUpdate(coapplicant, function() {
				done();
			}, done);
		},
		function(done) {
			//Update the user to point to the coapplicant id
			userDetails.insertOrUpdate({_id: userId, coUID: createdCoApp._id}, function() {
				done();
			}, done);
		},
        function(done){
            user.insertOrUpdate({hasUserDetails: true}, {email: coAppEmail}, function(coapp){
                done();
            }, done);
        }
	], function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Retrieve a user with all the details including type of user
 * @param uid
 * @param success
 * @param failure
 */
exports.findUserWithDetails = function(uid, success, failure){
	var user = new userModel();
	var userDetails = new userDetailsModel();

	var userWithDetails = {};

	async.series([
		function(done){
			userDetails.retrieve({_id: uid}, function(data){
				if(data[0].toObject !== undefined ) {
					userWithDetails = data[0].toObject();
				}
				done();
			}, done);
		},
		function(done){
			user.retrieve({_id: uid}, function(data){
				if(data[0].toObject !== undefined ) {
					_.extend(userWithDetails, {
						type: data[0].toObject().type
					});
				}
				done();
			});
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success(userWithDetails);
		}
	});
};


exports.lenderAppInvite = function(email, token, appId, success, failure){

	var user = new userModel(),
		userDetails = new userDetailsModel(),
		lenderInvites = new lenderInvitesModel(),
		applicationLenders = new applicationLendersModel();

	var userBasicInfo;
	async.series([
        function(done){
            lenderInvites.retrieve({email:email, token: token, isOpen:true}, function(invite){
                if(invite.length){
                    done();
                } else {
                    done({message: 'There is no active invite for this email.'});
                }
            });
        },
		function(done){
			user.retrieve({email: email}, function(userData){
				userBasicInfo = userData[0];
                if(!userBasicInfo){
                    done({message: 'This user doesn\'t exist'});
                } else {
                    done();
                }
				
			}, done);
		},
		function(done){
            if(userBasicInfo && !userBasicInfo.hasUserDetails){
                done();
            } else {
                async.parallel([
                    function(callback){
                        var previousUserDets;
                        async.series([
                            function(cb){
                                userDetails.retrieve({_id: userBasicInfo._id}, function(userDets){
                                    previousUserDets = userDets[0];
                                    cb();
                                }, cb);
                            },
                            function(cb){
                                if(_.indexOf(previousUserDets.appId, appId) < 0) {
                                    previousUserDets.appId.push(appId);
                                    userDetails.update({appId: previousUserDets.appId}, {_id: userBasicInfo._id}, null, cb, cb);
                                } else {
                                    cb();
                                }
                            }
                        ], function(error){
                            if(error){
                                callback(error);
                            } else {
                                callback();
                            }
                        });
                    },
                    function(callback){
                        lenderInvites.update({isOpen: false}, {appId: appId}, null, callback, callback);
                    },
                    function(callback){
                        applicationLenders.insert({lenderId: userBasicInfo._id, appId: appId}, callback, callback);
                    }
                ],function(error){
                    if(error){
                        done(error);
                    } else {
                        done();
                    }
                });
            }
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success();
		}
	});
};

var generatePassword = function(){
    return passwordGenerator(10);
};