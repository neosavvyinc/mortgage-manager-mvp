'use strict';

var userModel = require('../../../../lib/db/models/model-user-details').Model,
	applicationModel = require('../../../../lib/db/models/model-application').Model,
	baseModel = require('../../../../lib/db/models/model-base').Model,
	commonUtils = require('../../../../lib/utils/common-utils');

describe('modelUser',  function() {
	var user,
		application;

	beforeEach(function() {
		user = new userModel();
		application = new applicationModel();
	});

	describe('insertNewApp', function() {
		var retrieveSpy,
			insertSpy,
			updateSpy;

		beforeEach(function() {
			retrieveSpy = spyOn(baseModel.prototype, 'retrieve');
			insertSpy = spyOn(baseModel.prototype, 'insert');
			updateSpy = spyOn(baseModel.prototype, 'update');
		});

		it('should fail if userModel.retrieve fails', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				failure('retrieve fail');
			});

			application.insertNewApp({dummy: 'dummy'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('retrieve fail');
			});
		});

		it('should fail if userModel.retrieve returns 0 documents', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [];
				success(docs);
			});

			application.insertNewApp({dummy: 'dummy'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('Error: No documents found');
			});
		});

		it('should fail if userModel.retrieve returns more than 1 document', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					one: 'one'
				},
				{
					two: 'two'
				}];
				success(docs);
			});

			application.insertNewApp({dummy: 'dummy'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('Error: More than 1 document found');
			});
		});

		it('should fail if applicationModel.insert fails', function() {
			var docs = [{
				one: 'one'
			}];

			retrieveSpy.andCallFake(function(conditions, success, failure) {
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				failure('insert fail');
			});

			application.insertNewApp({dummy: 'dummy'}, {dummyTwo: 'dummy2'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('insert fail');
			});
		});

		it('should fail if userModel.update fails', function() {
			var docs = [{
				appId: [],
				one: 'one'
			}];

			retrieveSpy.andCallFake(function(conditions, success, failure) {
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				success();
			});

			updateSpy.andCallFake(function(item, conditions, options, success, failure) {
				failure('update fail');
			});

			application.insertNewApp({appId: []}, {dummy: 'dummy2'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('update fail');
			});
		});

		iit('should succeed if retrieve insert and update succeeds and document is a mongo object', function() {
			var checkItem = {
				dummy: 'dummy',
				_id: 'fakeId',
				created: 'date',
				lastModified: 'date',
				pUID: 'uId'
			};

			spyOn(commonUtils, 'generateId').andReturn('fakeId');
			spyOn(commonUtils, 'getCurrentDate').andReturn('date');

			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					appId: [],
					_id: 'uId',
					documents: [],
					status: 0,
					toObject: function() {
						return {
							appId: ['fakeId'],
							_id: 'uId'
						};
					}
				}];
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				expect(item).toEqual(checkItem);
				success();
			});

			updateSpy.andCallFake(function(item, conditions, options, success, failure) {
				expect(item).toEqual({ appId : [ 'fakeId' ], _id : 'uId' });
				success();
			});

			application.insertNewApp({_id: 'uId'}, {dummyTwo: 'dummy2'}, function() {
				expect(baseModel.prototype.retrieve.callCount).toBe(2);
				expect(baseModel.prototype.insert.callCount).toBe(1);
				expect(baseModel.prototype.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});

		it('should succeed if retrieve insert and update succeeds', function() {
			var checkItem = {
				dummy: 'dummy',
				_id: 'fakeId',
				created: 'date',
				lastModified: 'date',
				pUID: 'uId'
			};

			spyOn(commonUtils, 'generateId').andReturn('fakeId');
			spyOn(commonUtils, 'getCurrentDate').andReturn('date');

			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					appId: [],
					_id: 'uId'
				}];
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				expect(item).toEqual(checkItem);
				success();
			});

			updateSpy.andCallFake(function(item, conditions, options, success, failure) {
				expect(item).toEqual({ appId : [ 'fakeId' ], _id : 'uId' });
				success();
			});

			application.insertNewApp({dummy: 'dummy'}, {dummyTwo: 'dummy2'}, function() {
				expect(baseModel.prototype.retrieve.callCount).toBe(2);
				expect(baseModel.prototype.insert.callCount).toBe(1);
				expect(baseModel.prototype.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});
	});
});