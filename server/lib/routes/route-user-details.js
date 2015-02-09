'use strict';

var _ = require('underscore'),
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
        } else {
            userDetailsService.updateUser(userObject, function() {
                settings.log.info('Successfully updated user. User Id ' + uid);
                res.send({message: 'Success'});
                res.end();
            }, function(error) {
                if(error) {
                    settings.log.fatal(error.message);
                    res.status(500).send({message: 'Internal Server Error'});
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
        userDetailsService.createCoApplicant(uid, coapplicant, function() {
            settings.log.info('Successfully added co-applicant for user with uid ' + uid);
            res.send({message: 'Success'});
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