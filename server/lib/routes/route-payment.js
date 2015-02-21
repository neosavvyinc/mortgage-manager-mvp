'use strict';

var settings = require('../config/app/settings'),
	paymentService = require('../services/service-payment');

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
			console.log(error);
			console.log(error.message);
			console.log(error.code);
			if(error.message === 'Already made payment') {
				settings.log.fatal(error.message);
				res.status(401).send({message: 'You are already a premium user!'});
			} else if(error.code === 'StripeCardError') {
				settings.log.fatal(error.message);
				res.status(405).send(error.message);
			} else if (error.code === 'card_error') {
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