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

var fs = require('fs'),
	path = require('path'),
	db = require('../../../lib/db/db-insert'),
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
				return ['wrong.json'];
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('No model found with name wrong');
				});
		});

		it('should fail if saveToMongo fails for logins', function() {
			spyOn(model, 'findOneAndUpdate').andCallFake(function(json, item, options, callback) {
				var dbi = {
						_id: 1
					};
				callback(new Error('fail'), dbi);
			});

			spyOn(fs, 'readdirSync').andCallFake(function() {
				return ['login.json'];
			});

			dummyDb.operation(function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('Attempt to insert/update username banker failed: fail');
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
				return ['login.json'];
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
				return ['login.json'];
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
				return ['login.json'];
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