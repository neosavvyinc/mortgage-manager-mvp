'use strict';

var settings = require('../config/app/settings'),
	paymentService = require('../services/service-payment');

exports.makePayment = function(req, res) {
	var token = req.params.token,
		card = req.body.card,
		amount = req.body.amount;

	paymentService.makePayment(token, card, amount, function() {
		res.send({message: 'Success'}).end();
		settings.log.info('Payment successful');
	}, function(error) {
		if(error) {
			settings.log.fatal(error.message);
			res.status(500).send({message: 'Internal Server Error'});
		}
		res.end();
	});
};