'use strict';

var errorUtils = require('../../../lib/utils/error-utils');

describe('errorUtils', function() {
	it('should call the failure callback', function() {
		errorUtils.handleErrors(
			function() {
				throw new Error('fail');
			},
			function(error) {
				expect(error.message).toBe('fail');
			}
		);
	});

	it('should create an Error object if not already an Error object', function() {
		errorUtils.handleErrors(
			function() {
				throw 'fail';
			},
			function(error) {
				expect(error.message).toBe('fail');
			}
		);
	});
});