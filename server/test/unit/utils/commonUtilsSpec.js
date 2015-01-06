'use strict';

var commonUtils = require('../../../lib/utils/commonUtils'),
	settings = require('../../../lib/config/settings');

describe('commonUtils', function() {
	describe('dereference', function() {
		it('test fullfilled path', function() {
			var object = {
				a: {
					b:'c'
				}
			};
			expect(commonUtils.dereference(object, 'a.b')).toBe('c');
		});

		it('test indexed path', function() {
			var object = {
				a: {
					b: ['x', 'y']
				}
			};
			expect(commonUtils.dereference(object, 'a.b.1')).toBe('y');
		});

		it('test un-fullfilled path', function() {
			var object={};
			expect(commonUtils.dereference(object, 'a.b', 'dogs')).toBe('dogs');
		});
	});
});