'use strict';

var commonUtils = require('../../../lib/utils/commonUtils'),
	settings = require('../../../lib/config/app/settings');

describe('commonUtils', function() {
	describe('dereference', function() {
		it('test fulfilled path', function() {
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

		it('test un-fulfilled path', function() {
			var object={};
			expect(commonUtils.dereference(object, 'a.b', 'dogs')).toBe('dogs');
		});
	});

	describe('getLogger', function() {
		it('should call getLogger', function() {
			var checkLogger = { category : 'dev', _events : { log : Function }, level : { level : 20000, levelStr : 'INFO' } },
				logger;

			spyOn(settings, 'getConfig').andCallFake(function() {
				return {
					'port': 3000,
					'dbURL': 'mongodb://localhost/MAM',
					'logging': {
						'levels': {
							'dev': 'info'
						},
						'appenders': [
							{
								'type': 'console',
								'category': 'dev'
							}
						]
					}
				};
			});
			logger = commonUtils.getLogger();
			expect(JSON.stringify(logger)).toEqual(JSON.stringify(checkLogger));
		});
	});
});