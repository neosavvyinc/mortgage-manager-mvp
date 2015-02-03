'use strict';

var config = {};

/**
 * Sets the environment variables from the config json
 * @param json
 */
exports.setConfig = function(json) {
	config = JSON.parse(json);
};

exports.getConfig = function() {
	return config;
};

exports.secretKey = 'MamSecretKey';

exports.log = {};