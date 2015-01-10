'use strict';

/**
 * Serves as a healthcheck
 * @param req
 * @param res
 */
exports.healthCheck = function(req, res) {
	res.set({'Content-Type':'text/plain'});
	res.send('ok');
};