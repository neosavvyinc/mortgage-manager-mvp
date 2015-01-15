'use strict';

var serviceLogin = require('../../../lib/services/service-auth'),
	userModel = require('../../../lib/db/models/model-user').Model;

describe('serviceLogin', function() {

	describe('findUser', function() {
		var retrieveSpy;

		beforeEach(function() {
			retrieveSpy = spyOn(userModel.prototype, 'retrieve');
		});

		it('should fail if userModel.retrieve fails', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({foo: 'bar'});
				failure('fail');
			});

			serviceLogin.findUser({foo: 'bar'}, function(error, docs) {
				if(error) {
					expect(error).toBe('fail');
				} else {
					expect().toHaveNotExecuted('Should not have succeeded.');
				}
			});
		});

		it('should succeed if userModel.retrieve succeeds', function() {
			retrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({foo: 'bar'});
				success([{foo: 'success'}]);
			});

			serviceLogin.findUser({foo: 'bar'}, function(error, docs) {
				if(error) {
					expect().toHaveNotExecuted('Should not have failed.');
				} else {
					expect(docs).toEqual([{foo: 'success'}]);
				}
			});
		});
	});

	describe('createUser', function() {
		var insertSpy;

		beforeEach(function() {
			insertSpy = spyOn(userModel.prototype, 'insertOrUpdate');
		});

		it('should fail if userModel.retrieve fails', function() {
			insertSpy.andCallFake(function(item, conditions, success, failure) {
				expect(item).toEqual({foo: 'bar', email: 'email'});
				expect(conditions).toEqual({email: 'email'});
				failure('fail');
			});

			serviceLogin.createUser({foo: 'bar', email: 'email'}, function(error) {
				if(error) {
					expect(error).toBe('fail');
				} else {
					expect().toHaveNotExecuted('Should not have succeeded.');
				}
			});
		});

		it('should succeed if userModel.retrieve succeeds', function() {
			insertSpy.andCallFake(function(item, conditions, success, failure) {
				expect(item).toEqual({foo: 'bar', email: 'email'});
				expect(conditions).toEqual({email: 'email'});
				success();
			});

			serviceLogin.createUser({foo: 'bar', email: 'email'}, function(error) {
				if(error) {
					expect().toHaveNotExecuted('Should not have failed.');
				} else {
					expect(userModel.prototype.insertOrUpdate.callCount).toBe(1);
				}
			});
		});
	});
});