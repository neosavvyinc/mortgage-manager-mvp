'use strict';

var commonUtils = require('../utils/commonUtils'),
	model = require('./model');

exports.createAuth = function(name, type, config, access) {
	commonUtils.assertRequired(name);
	commonUtils.assertRequired(type);
	return new model.Auth({name:name, type:type, config:config, access:access});
};