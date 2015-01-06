'use strict';

var dbBase = require('../../../lib/db/db-base');
var db = require('../../../lib/db/db');

describe('dbBase', function() {
	var dummyBase;

	beforeEach(function() {
		dummyBase = new dbBase.Db('url');
	});

	it('abstract getData should throw error', function() {
		expect(dummyBase.operation).toThrow('Must implement');
	});

	describe('initialize', function() {
		var dbConnectSpy;

		beforeEach(function() {
			dbConnectSpy = spyOn(db, 'connect');
		});

		it('should connect using mongoose and succeed if db connect succeeds', function() {
			dbConnectSpy.andCallFake(function(url, success, failure) {
				expect(url).toBe('url');
				success();
			});

			dummyBase.initialize(dummyBase,
			function() {
				expect(db.connect.callCount).toBe(1);
			},
			function() {
				expect().toHaveNotExecuted('Test failed. Should not be here');
			});
		});

		it('should connect using mongoose and fail if db connect fails', function() {
			dbConnectSpy.andCallFake(function(url, success, failure) {
				expect(url).toBe('url');
				failure(new Error('failed'));
			});

			dummyBase.initialize(dummyBase,
				function() {
					expect().toHaveNotExecuted('Should not succeed');
				},
				function(error) {
					expect(error.message).toBe('failed');
				});
		});
	});

	describe('run', function() {
		var dbInitializeSpy,
			dbOperationSpy;

		beforeEach(function() {
			dbInitializeSpy = spyOn(dummyBase, 'initialize');
			dbOperationSpy = spyOn(dummyBase, 'operation');
		});

		it('should fail if initialize fails', function() {
			dbInitializeSpy.andCallFake(function(self, success, failure) {
				failure(new Error('initialize failed'));
			});

			dbOperationSpy.andCallFake(function(success, failure) {
				success();
			});

			dummyBase.run(
				function() {
					expect().toHaveNotExecuted('Should not succeed');
				},
				function(error) {
					expect(error.message).toBe('initialize failed');
				});
		});

		it('should fail if operation fails', function() {
			dbInitializeSpy.andCallFake(function(self, success, failure) {
				success();
			});

			dbOperationSpy.andCallFake(function(success, failure) {
				expect(dummyBase.initialize.callCount).toBe(1);
				expect(dummyBase.operation.callCount).toBe(1);
				failure(new Error('operation failed'));
			});

			dummyBase.run(
				function() {
					expect().toHaveNotExecuted('Should not succeed');
				},
				function(error) {
					expect(dummyBase.initialize.callCount).toBe(1);
					expect(dummyBase.operation.callCount).toBe(1);
					expect(error.message).toBe('operation failed');
				});
		});

		it('should succeed if both initialize and operation succeed', function() {
			dbInitializeSpy.andCallFake(function(self, success, failure) {
				success();
			});

			dbOperationSpy.andCallFake(function(success, failure) {
				success();
			});

			dummyBase.run(
				function() {
					expect(dummyBase.initialize.callCount).toBe(1);
					expect(dummyBase.operation.callCount).toBe(1);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not fail');
				});
		});
	});
});