'use strict';

var _ = require('underscore'),
	userDetailsService = require('../services/service-user-details');

/**
 * Route handler for updating a particular user's details
 * @param req
 * @param res
 */
exports.updateUser = function(req, res) {
	var userObject = req.body,
		uid = req.params.uid;

	_.extend(userObject, {
		_id: uid
	});

	userDetailsService.updateUser(userObject, function() {
		res.send({message: 'Success'});
		res.end();
	}, function(error) {
		if(error) {
			res.send({code: 500, message: 'Internal Server Error'});
		}
		res.end();
	});
};

/**
 * Route handler for creating a coapplicant for a particular user
 * @param req
 * @param res
 */
exports.addCoApplicant = function(req, res) {
	var coapplicant = req.body,
		uid = req.params.uid;

	userDetailsService.createCoApplicant(uid, coapplicant, function() {
		res.send({message: 'Success'});
		res.end();
	}, function(error) {
		if(error) {
			res.send({code: 500, message: 'Internal Server Error'});
		}
		res.end();
	});
};