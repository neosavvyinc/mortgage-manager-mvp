'use strict';

var userModel = require('../../../../lib/db/models/model-user-details').Model,
	applicationModel = require('../../../../lib/db/models/model-application').Model,
	baseModel = require('../../../../lib/db/models/model-base').Model,
	commonUtils = require('../../../../lib/utils/common-utils');

describe('modelApplication',  function() {
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

		it('should succeed if retrieve insert and update succeeds and document is a mongo object', function() {
			var checkItem = {
				_id: 'fakeId',
				created: 'date',
				lastModified: 'date',
				pUID: 'uId',
				documents: [],
				status: 0,
				cUID: 'couId'
			};

			spyOn(commonUtils, 'generateId').andReturn('fakeId');
			spyOn(commonUtils, 'getCurrentDate').andReturn('date');

			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					appId: [],
					_id: 'uId',
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

			application.insertNewApp({_id: 'uId', appId: []}, {_id: 'couId'}, function() {
				expect(baseModel.prototype.insert.callCount).toBe(1);
				expect(baseModel.prototype.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});

		it('should succeed if retrieve insert and update succeeds', function() {
			var checkItem = {
				_id: 'fakeId',
				created: 'date',
				lastModified: 'date',
				pUID: 'uId',
				documents: [],
				status: 0,
				cUID: 'couId'
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

			application.insertNewApp({_id: 'uId', appId: []}, {_id: 'couId'}, function() {
				expect(baseModel.prototype.insert.callCount).toBe(1);
				expect(baseModel.prototype.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});
	});

	describe('updateApplication', function() {
		var findOneDocumentSpy,
			updateSpy;

		beforeEach(function() {
			findOneDocumentSpy = spyOn(baseModel.prototype, 'findOneDocument');
			updateSpy = spyOn(baseModel.prototype, 'update');
		});

		it('should fail if applicationModel.findOneDocument fails', function() {
			findOneDocumentSpy.andCallFake(function(conditions, success, failure) {
				failure('findOneDocument fail');
			});

			application.updateApplication('1234', {one: 'one'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('findOneDocument fail');
			});
		});

		it('should fail if applicationModel.findOneDocument returns 0 documents', function() {
			findOneDocumentSpy.andCallFake(function(conditions, success, failure) {
				success({_id:'1234'});
			});

			application.updateApplication('1234', {one: 'one'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('Error: No documents found');
			});
		});

		it('should fail if applicationModel.findOneDocument returns more than 1 document', function() {
			findOneDocumentSpy.andCallFake(function(conditions, success, failure) {
				var docs = [
					{
						one: 'one'
					},
					{
						two: 'two'
					}];
				success(docs);
			});

			application.updateApplication('1234', {one: 'one'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('Error: More than 1 document found');
			});
		});



		it('should fail if applicationModel.update fails', function() {
			findOneDocumentSpy.andCallFake(function(item, success, failure) {
				success({_id:'1234'});
			});

			updateSpy.andCallFake(function(item, conditions, options, success, failure) {
				failure('update fail');
			});

			application.updateApplication({appId: []}, {dummy: 'dummy2'}, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('update fail');
			});
		});

		it('should succeed if update succeeds', function() {

			findOneDocumentSpy.andCallFake(function(conditions, success, failure) {
				var doc = {
					appId: [],
					_id: 'uId'
				};
				success(doc);
			});

			updateSpy.andCallFake(function(item, conditions, options, success, failure) {
				expect(item).toEqual({ documents : [  ], _id : 'couId' });
				success();
			});

			application.updateApplication({_id: 'uId', appId: []}, {_id: 'couId'}, function() {
				expect(baseModel.prototype.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});
	});
});