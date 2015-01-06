/**
 * @preserve Copyright (c) 2014 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

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
