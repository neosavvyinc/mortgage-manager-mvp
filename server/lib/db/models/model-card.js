'use strict';

var util = require('util'),
	baseModel = require('./model-base'),
	Schemas = require('../schemas').Schemas,
	cardSchema = Schemas.CardSchema,
	cardModel;

/**
 * Constructor for the user model
 */
function CardModel() {
	CardModel.super_.call(this);
	CardModel.prototype.init('card', cardSchema);
}

util.inherits(CardModel, baseModel.Model);

cardModel = CardModel.prototype;

exports.Model = CardModel;