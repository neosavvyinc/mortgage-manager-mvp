'use strict';

beforeEach(function() {
	var matchers = {
		toHaveNotExecuted: function(error) {
			this.message = function () {
				return error;
			};
			return false;
		},
		toHaveExecuted: function() {
			return true;
		}
	};

	this.addMatchers(matchers);
});