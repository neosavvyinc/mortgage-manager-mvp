'use strict';

var commonUtils = require('../utils/commonUtils'),
	model = require('./model');

exports.createLogin = function(username, password, type, created) {
	commonUtils.assertRequired(username);
	commonUtils.assertRequired(password);
	commonUtils.assertRequired(type);
	commonUtils.assertRequired(created);
	return new model.Login({
		name: username,
		password: password,
		type: type,
		created: created
	});
};