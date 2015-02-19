'use strict';

var stripeConfig = require('../config/app/stripe'),
	stripe = require('stripe')(stripeConfig.testSecretKey);

/**
 * Makes a payment to stripe using the stripe Node API
 * @param token
 * @param card
 * @param amount
 * @param success
 * @param failure
 */
exports.makePayment = function(token, card, amount, success, failure) {

	stripe.charges.create({
		amount: amount * 100,
		currency: 'usd',
		card: token,
		description: 'Charging $'+ amount + ' for the mortgage app'
	}, function(err, charge) {
		if(err) {
			failure(err);
		} else {
			success(charge);
		}
	});
};