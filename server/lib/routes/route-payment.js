'use strict';

var settings = require('../config/app/settings'),
	paymentService = require('../services/service-payment');

/**
 * Route handler for getting the publishable key
 * @param req
 * @param res
 */
exports.getPublishableKey = function(req, res) {
	var config = settings.getConfig(),
		publishableKey = config.stripe.publishableKey;

	res.send(publishableKey);
	settings.log.info('Sending publishable key to client');
};

/**
 * Route handler for incoming payments
 * @param req
 * @param res
 */
exports.makePayment = function(req, res) {
	var token = req.params.token,
		card = req.body.card,
		amount = req.body.amount,
		idempotentToken = req.body.idempotentToken,
		uid = req.user._id;

	paymentService.makePayment(uid, token, card, amount, idempotentToken, function() {
		res.send({message: 'Success'}).end();
		settings.log.info('Payment successful');
	}, function(error) {
		if(error) {
			if(error.message === 'Already made payment') {
				settings.log.fatal(error.message);
				res.status(401).send({message: 'You are already a premium user!'});
			} else if(error.code === 'StripeCardError' || error.code === 'card_error') {
				settings.log.fatal(error.message);
				res.status(405).send(error.message);
			} else if (error.code === 'api_error') {
				settings.log.fatal(error.message);
				res.status(503).send(error.message);
			} else {
				settings.log.fatal(error);
				res.status(500).send({message: 'Internal Server Error'});
			}
		}
		res.end();
	});
};