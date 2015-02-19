'use strict';

var util = require('util'),
	baseModel = require('./model-base'),
	Schemas = require('../schemas').Schemas,
	paymentSchema = Schemas.PaymentSchema,
	paymentModel;

/**
 * Constructor for the payment model
 */
function PaymentModel() {
	PaymentModel.super_.call(this);
	PaymentModel.prototype.init('payment', paymentSchema);
}

util.inherits(PaymentModel, baseModel.Model);

paymentModel = PaymentModel.prototype;

exports.Model = PaymentModel;