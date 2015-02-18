'use strict';

/**
 * Surrounds the callback with a try block and catches exceptions.
 * @param callback{function} - Function block that is checked for exceptions
 * @param failure{function} - Function that is called if there is an exception.
 */

exports.handleErrors = function(callback, failure) {
	try {
		callback();
	} catch(error) {
		if(error instanceof Error) {
			failure(error);
		} else {
			failure(new Error(error));
		}
	}
};
