'use strict';

var fs = require('fs'),
	path = require('path'),
	db = require('../../../lib/db/scripts/db-insert'),
	model = require('mongoose/lib/model');

describe('dbInsert', function() {
	var dummyDb,
		resolveSpy;
	beforeEach(function() {
		dummyDb = new db.Db('url');
		resolveSpy = spyOn(path, 'resolve').andCallFake(function() {
			return __dirname + '/resources/withdata';
		});
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
			spyOn(model, 'findOneAndUpdate').andCallFake(function(json, item, options, callback) {
				var dbi = {
						_id: 1
					};
				callback(new Error('fail'), dbi);
			});

			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['1.user.json'];
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					console.log(error);
					expect(error).toBe('Update: Attempt to update user1 failed: fail');
				});
		});

		it('should succeed if findOneAndUpdate returns a null id', function() {
			spyOn(model, 'findOneAndUpdate').andCallFake(function(json, item, options, callback) {
				var dbi = {
					_id: null
				};
				callback(null, dbi);
			});

			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['1.user.json'];
			});

			dummyDb.operation(function() {
					expect(fs.readdirSync.callCount).toBe(1);
					expect(model.findOneAndUpdate.callCount).toBe(2);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});

		it('should succeed if all jsons are empty', function() {
			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['1.user.json', '2.application.json'];
			});

			resolveSpy.andCallFake(function() {
				return __dirname + '/resources/empty';
			});

			dummyDb.operation(function() {
					expect(fs.readdirSync.callCount).toBe(1);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});

		it('should succeed if both getResources and saveToMongo succeed', function() {
			spyOn(model, 'findOneAndUpdate').andCallFake(function(json, item, options, callback) {
				var dbi = {
					_id: 1
				};
				callback(null, dbi);
			});

			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['1.user.json'];
			});

			dummyDb.operation(function() {
					expect(fs.readdirSync.callCount).toBe(1);
					expect(model.findOneAndUpdate.callCount).toBe(2);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});
});