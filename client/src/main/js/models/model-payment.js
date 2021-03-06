'use strict';

var Q = require('q'),
	_ = require('lodash'),
	$ = require('jquery'),
	Endpoints = require('../constants/endpoints');

function PaymentModel () { }

PaymentModel.createToken = function(form, responseHandler) {
	Stripe.card.createToken(form, responseHandler);
};

PaymentModel.makePayment = function(token, card, idempotentToken, amount) {
	return Q.promise(function(resolve, reject){
		$.post(Endpoints.PAYMENT.URL.replace(':token', token), {
			card: card,
			amount: amount,
			idempotentToken: idempotentToken
		}).success(function(response){
			resolve(response);
		}).error(function(error){
			reject(error.responseJSON);
		});
	});
};

PaymentModel.getPublishableKey = function() {
	return Q.promise(function(resolve, reject) {
		$.get(Endpoints.STRIPE.URL)
		.success(function(response){
			resolve(response);
		}).error(function(error){
			reject(error.responseJSON);
		});
	});
};

module.exports = PaymentModel;