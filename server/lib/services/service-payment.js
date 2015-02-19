'use strict';

var async = require('async'),
	commonUtils = require('../utils/common-utils'),
	paymentModel = require('../db/models/model-payment').Model,
	cardModel = require('../db/models/model-card').Model,
	userModel = require('../db/models/model-user').Model,
	userDetailsModel = require('../db/models/model-user-details').Model,
	stripeConfig = require('../config/app/stripe'),
	stripe = require('stripe')(stripeConfig.testSecretKey);

/**
 * Makes a payment to stripe using the stripe Node API
 * @param uid
 * @param token
 * @param card
 * @param amount
 * @param success
 * @param failure
 */
exports.makePayment = function(uid, token, card, amount, success, failure) {
	var charge,
		coAppId,
		payment = new paymentModel(),
		cardInstance = new cardModel(),
		user = new userModel(),
		userDetails = new userDetailsModel(),
		cardId = commonUtils.generateId(),
		paymentId = commonUtils.generateId(),
		currentDate = new Date();

	async.series([
		function(done) {
			//Check if card already exists and store the card token
			cardInstance.retrieve({token: token}, function(docs) {
				if(docs.length > 0) {
					done();
				} else {
					//Save card details to card Object
					cardInstance.insert({_id: cardId, token: token, uid: uid, card: card}, function() {
						done();
					}, done);
				}
			}, done);
		},
		function(done) {
			stripe.charges.create({
				amount: amount * 100,
				currency: 'usd',
				card: token,
				description: 'Charging $'+ amount + ' for the mortgage app'
			}, function(err, _charge) {
				if(err) {
					done(err);
				} else {
					charge = _charge;
					done();
				}
			});
		},
		function(done) {
			//Change plan for user to premium
			user.update({pricingPlan: 'premium'}, {_id: uid}, null, done, done);
		},
		function(done) {
			userDetails.retrieve({_id: uid}, function(docs) {
				coAppId = docs[0].toObject().coUID;
				done();
			}, done);
		},
		function(done) {
			if(coAppId === undefined) {
				done();
			} else {
				//Change plan for coapplicant to premium
				user.update({pricingPlan: 'premium'}, {_id: coAppId}, null, done, done);
			}
		},
		function(done) {
			//Save payment details
			payment.insert({_id: paymentId, cardId: cardId, amount: amount, paymentDate: currentDate}, function() {
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