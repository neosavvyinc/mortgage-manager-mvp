'use strict';

var bCrypt = require('bcrypt-nodejs'),
	userModel = require('../../../../lib/db/models/model-user').Model,
	baseModel = require('../../../../lib/db/models/model-base').Model;

describe('modelUser',  function() {
	var user;

	beforeEach(function() {
		user = new userModel();
	});

	describe('insertOrUpdate', function() {
		var retrieveSpy,
			insertSpy,
			updateSpy,
			hashSpy;

		beforeEach(function() {
			retrieveSpy = spyOn(baseModel.prototype, 'retrieve');
			insertSpy = spyOn(baseModel.prototype, 'insert');
			updateSpy = spyOn(baseModel.prototype, 'update');
			hashSpy = spyOn(bCrypt, 'hashSync').andReturn('foo');
		});

		it('should fail if userModel.retrieve fails', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				failure('retrieve fail');
			});

			user.insertOrUpdate({dummy: 'dummy'}, null, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('retrieve fail');
			});
		});

		it('should fail userModel.insert fails', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [];
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				failure('insert fail');
			});

			user.insertOrUpdate({dummy: 'dummy'}, null, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('insert fail');
			});
		});

		it('should fail if userModel.update fails', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					_id: '123',
					one: 'one'
				}];
				success(docs);
			});

			updateSpy.andCallFake(function(item, conditons, options, success, failure) {
				failure('update fail');
			});

			user.insertOrUpdate({dummy: 'dummy'}, null, function() {
				expect().toHaveNotExecuted('should not have succeeded');
			}, function(error) {
				expect(error).toBe('update fail');
			});
		});

		it('should call insert and succeed if no documents are found', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [];
				success(docs);
			});

			insertSpy.andCallFake(function(item, success, failure) {
				success();
			});

			user.insertOrUpdate({dummy: 'dummy'}, null, function() {
				expect(user.retrieve.callCount).toBe(1);
				expect(user.insert.callCount).toBe(1);
				expect(user.update.callCount).toBe(0);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});

		it('should call update and succeed if one document is found', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				var docs = [{
					_id: '123',
					one: 'one'
				}];
				success(docs);
			});

			updateSpy.andCallFake(function(item, conditons, options, success, failure) {
				success();
			});

			user.insertOrUpdate({dummy: 'dummy'}, null, function() {
				expect(user.retrieve.callCount).toBe(1);
				expect(user.insert.callCount).toBe(0);
				expect(user.update.callCount).toBe(1);
			}, function(error) {
				expect().toHaveNotExecuted('should not have failed');
			});
		});
	});
});