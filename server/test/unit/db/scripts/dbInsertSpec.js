'use strict';

var fs = require('fs'),
	path = require('path'),
	db = require('../../../../lib/db/scripts/db-insert'),
	userModel = require('../../../../lib/db/models/model-user').Model,
	applicationModel = require('../../../../lib/db/models/model-application').Model;

describe('dbInsert', function() {
	var dummyDb,
		resolveSpy,
		userInsertSpy,
		applicationInsertSpy;

	beforeEach(function() {
		dummyDb = new db.Db('url');
		resolveSpy = spyOn(path, 'resolve').andCallFake(function() {
			return __dirname.split('scripts')[0] + '/resources/withdata';
		});

		userInsertSpy = spyOn(userModel.prototype, 'insertOrUpdate');
		applicationInsertSpy = spyOn(applicationModel.prototype, 'insertNewApp');
	});

	describe('operation', function() {
		it('should fail if getResources fails', function() {
			spyOn(fs, 'readdirSync').andCallFake(function() {
				throw new Error('fail');
			});
			dummyDb.operation(function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error.message).toBe('fail');
			});
		});

		it('should fail if no model is found', function() {
			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['1.wrong.json'];
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('No model found with name wrong');
				});
		});

		it('should fail if saveToMongo fails for user', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				failure('user fail');
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('user fail');
				});
		});

		it('should fail if saveToMongo fails for application', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			applicationInsertSpy.andCallFake(function(item, success, failure) {
				failure('application fail');
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('application fail');
				});
		});

		it('should succeed if all jsons are empty', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			applicationInsertSpy.andCallFake(function(item, success, failure) {
				success();
			});

			resolveSpy.andCallFake(function() {
				return __dirname.split('scripts')[0] + '/resources/empty';
			});

			dummyDb.operation(function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});

		it('should succeed if both getResources and saveToMongo succeed', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			applicationInsertSpy.andCallFake(function(item, success, failure) {
				success();
			});

			dummyDb.operation(function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});
});