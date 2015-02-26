'use strict';

var _ = require('underscore'),
    async = require('async'),
	userDetailsService = require('../services/service-user-details'),
	settings = require('../config/app/settings'),
    validationUtils = require('../utils/validation-utils');

/**
 * Route handler for updating a particular user's details
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
	var userObject = req.body,
		uid = req.params.uid;

    if(uid === req.user._id){
        _.extend(userObject, {
            _id: uid
        });

        if(validationUtils.validatePhone(userObject.phone).errors.length){
            res.status(400).send({message: 'You have to provide a valid phone'});
            res.end();
        }  else if(validationUtils.validateZip(userObject.zip).errors.length){
            res.status(400).send({message: 'You have to provide a valid zip code'});
            res.end();
        } else {
            async.series([
                function(done){
                    userDetailsService.getUserDetails({phone:  userObject.phone}, function(userDetailsData){
                        if(userDetailsData[0] && userDetailsData[0].phone === userObject.phone){
                            done({message: 'This phone number is already in use'});
                        } else {
                            done();
                        }
                    }, function(){
                        done({message: 'Internal Server Error'});
                    });
                },
                function(done){
                    userDetailsService.updateUser(userObject, done, done);
                }
            ],function(error){
                if(error){
                    settings.log.fatal(error.message);
                    res.status(500).send(error);
                } else {
                    res.send({message: 'Success'});
                }
                res.end();
            });
        }
    } else {
        res.status(500).send({message: 'Internal Server Error'});
        res.end();
    }
};

exports.getUserDetails = function(req, res){
	var uid = req.params.uid;
    if(uid === req.user._id){
        userDetailsService.findUserWithDetails(uid, function(userWithDetails) {
            settings.log.info('Get user details success. Uid: ' + uid);
	        userWithDetails.email = req.user.email;
            res.send(userWithDetails);
            res.end();
        }, function(error) {
            if(error) {
                settings.log.fatal(error.message);
                res.status(500).send({message: 'Internal Server Error'});
            }
            res.end();
        });
    } else {
        res.status(500).send({message: 'Internal Server Error'});
        res.end();
    }
};

/**
 * Route handler for creating a coapplicant for a particular user
 * @param req
 * @param res
 */
exports.addCoApplicant = function(req, res) {
	var coapplicant = req.body,
		uid = req.params.uid;

    if( uid === req.user._id){
        async.series([
            function(done){
                userDetailsService.getUserDetails({phone:  coapplicant.phone}, function(userDetailsData){
                    if(userDetailsData[0] && userDetailsData[0].phone === coapplicant.phone){
                        done({message: 'This phone number is already in use'});
                    } else {
                        done();
                    }
                }, function(){
                    done({message: 'Internal Server Error'});
                });
            },
            function(done){
                userDetailsService.createCoApplicant(uid, coapplicant, function(){
                    done();
                }, function(err){
                    done(err);
                });
            }
        ],function(error){
            if(error){
                settings.log.fatal(error.message);
                res.status(500).send(error.message);
            } else {
                settings.log.info('Successfully added co-applicant for user with uid ' + uid);
                res.send({message: 'Success'});
            }
            res.end();
        });
    } else {
        res.status(500).send({message: 'Internal Server Error'});
        res.end();
    }
};