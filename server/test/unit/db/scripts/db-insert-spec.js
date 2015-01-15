'use strict';

var fs = require('fs'),
	path = require('path'),
	db = require('../../../../lib/db/scripts/db-insert'),
	baseModel = require('../../../../lib/db/models/model-base').Model,
	userModel = require('../../../../lib/db/models/model-user').Model,
	userDetailsModel = require('../../../../lib/db/models/model-user-details').Model,
	applicationModel = require('../../../../lib/db/models/model-application').Model;

describe('dbInsert', function() {
	var dummyDb,
		resolveSpy,
		userInsertSpy,
		userDetailsInsertSpy,
		applicationInsertSpy;


	beforeEach(function() {
		dummyDb = new db.Db('url');
		resolveSpy = spyOn(path, 'resolve').andCallFake(function() {
			return __dirname.split('scripts')[0] + '/resources/withdata';
		});

		userInsertSpy = spyOn(userModel.prototype, 'insertOrUpdate');
		userDetailsInsertSpy = spyOn(userDetailsModel.prototype, 'insertOrUpdate');
		applicationInsertSpy = spyOn(applicationModel.prototype, 'insertNewApp');
	});

	describe('operation', function() {
		var dbGetMongoIdSpy;

		beforeEach(function() {
			dbGetMongoIdSpy = spyOn(db.Db.prototype, 'getMongoId');
		});

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

		it('should fail if getMongoId fails', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			dbGetMongoIdSpy.andCallFake(function(Model, conditions, success, failure) {
				failure('get mongoId fail');
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('get mongoId fail');
				});
		});

		it('should fail if saveToMongo fails for userdetails', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			dbGetMongoIdSpy.andCallFake(function(Model, conditions, success, failure) {
				success();
			});

			userDetailsInsertSpy.andCallFake(function(item, success, failure) {
				failure('user details fail');
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('user details fail');
				});
		});

		it('should fail if saveToMongo fails for application', function() {
			userInsertSpy.andCallFake(function(item, condition, success, failure) {
				success();
			});

			dbGetMongoIdSpy.andCallFake(function(Model, conditions, success, failure) {
				success();
			});

			userDetailsInsertSpy.andCallFake(function(item, success, failure) {
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

			dbGetMongoIdSpy.andCallFake(function(Model, conditions, success, failure) {
				success();
			});

			userDetailsInsertSpy.andCallFake(function(item, success, failure) {
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

			dbGetMongoIdSpy.andCallFake(function(Model, conditions, success, failure) {
				success();
			});

			userDetailsInsertSpy.andCallFake(function(item, success, failure) {
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

	describe('getMongoId', function() {
		var baseFindDocSpy;

		beforeEach(function() {
			baseFindDocSpy = spyOn(baseModel.prototype, 'findOneDocument');
		});

		it('should fail if findOneDocument fails', function() {
			baseFindDocSpy.andCallFake(function(condtions, success, failure) {
				failure('fail');
			});

			dummyDb.getMongoId(new userModel(), {}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('fail');
			});
		});

		it('should succeed if findOneDocument succeeds', function() {
			baseFindDocSpy.andCallFake(function(condtions, success, failure) {
				success({_id: '123'});
			});

			dummyDb.getMongoId(new userModel(), {}, function(id) {
				expect(id).toBe('123');
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});
	});
});