'use strict';

var serviceUserDetails = require('../../../lib/services/service-user-details'),
	userDetailsModel = require('../../../lib/db/models/model-user-details').Model,
	userModel = require('../../../lib/db/models/model-user').Model;

describe('serviceUserDetails', function() {
	var userInsertSpy,
		userDetailsInsertSpy,
		userDetailsRetrieveSpy,
		userRetrieveSpy;

	beforeEach(function () {
		userInsertSpy = spyOn(userModel.prototype, 'insertOrUpdate');
		userDetailsInsertSpy = spyOn(userDetailsModel.prototype, 'insertOrUpdate');
		userDetailsRetrieveSpy = spyOn(userDetailsModel.prototype, 'retrieve');
		userRetrieveSpy = spyOn(userModel.prototype, 'retrieve');
	});

	describe('updateUser', function() {
		it('should call userDetails.insertOrUpdate', function() {
			userDetailsInsertSpy.andCallFake(function(obj, success, failure) {
				success();
			});

			serviceUserDetails.updateUser({}, function() {
				expect(userDetailsModel.prototype.insertOrUpdate.callCount).toBe(1);
			},
			function(error) {
				expect().toHaveNotExecuted('Should not have failed');
			});
		});
	});

	describe('createCoApplicant', function() {
		it('should fail if userModel.insertOrUpdate fails', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect({email: obj.email, type: obj.type}).toEqual({email: 'bar', type:'dashboard'});
				failure('coapplicant user insert failed');
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: 'default', type:'dashboard'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('coapplicant user insert failed');
			});
		});

		it('should fail if userDetailsModel.insertOrUpdate fails while creating coapplicant', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect({email: obj.email, type: obj.type}).toEqual({email: 'bar', type:'dashboard'});
				success({_id: '222'});
			});

			userDetailsInsertSpy.andCallFake(function(obj, success, failure) {
				expect(obj).toEqual({_id: '222'});
				failure('coapplicant details insert failed');
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: 'default', type:'dashboard'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('coapplicant details insert failed');
			});
		});

		it('should fail if userDetailsModel.insertOrUpdate fails while updating user with coapplicant id', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect({email: obj.email, type: obj.type}).toEqual({email: 'bar', type:'dashboard'});
				success({_id: '222'});
			});

			userDetailsInsertSpy.andCallFake(function(obj, success, failure) {
				if(userDetailsModel.prototype.insertOrUpdate.callCount === 1) {
					expect(obj).toEqual({_id: '222'});
					success();
				} else {
					expect(obj).toEqual({ _id : '123', coUID : '222' });
					failure('user details update failed');
				}
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: 'default', type:'dashboard'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('user details update failed');
			});
		});

		it('should succeed if all insertOrUpdate functions succeed', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect({email: obj.email, type: obj.type}).toEqual({email: 'bar', type:'dashboard'});
				success({_id: '222'});
			});

			userDetailsInsertSpy.andCallFake(function(obj, success, failure) {
				if(userDetailsModel.prototype.insertOrUpdate.callCount === 1) {
					expect(obj).toEqual({_id: '222'});
					success();
				} else {
					expect(obj).toEqual({ _id : '123', coUID : '222' });
					success();
				}
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: 'default', type:'dashboard'}, function() {
				expect().toHaveExecuted();
			},
			function(error) {
				expect().toHaveNotExecuted('Should not have failed');
			});
		});
	});

	describe('findUserWithDetails', function() {
		it('should fail if userDetails<pde;.retrieve fails', function() {
			userDetailsRetrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({_id:{email: 'bar', password: 'default', type:'dashboard'}});
				failure('user details find failed');
			});

			serviceUserDetails.findUserWithDetails({email: 'bar', password: 'default', type:'dashboard'}, function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('user details find failed');
				});
		});

		it('should fail if userModel.retrieve fails', function() {
			userRetrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({email: 'bar', password: 'default', type:'dashboard'});
				failure('user find failed');
			});

			serviceUserDetails.findUserWithDetails({email: 'bar', password: 'default', type:'dashboard'}, function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('user find failed');
				});
		});

		it('should succeed if all insertOrUpdate functions succeed', function() {
			userRetrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({_id: '123'});
				success([{_id: '123'}]);
			});

			userDetailsRetrieveSpy.andCallFake(function(conditions, success, failure) {
				expect(conditions).toEqual({_id: '123'});
				success([{_id: '123', type: 'borrower'}]);
			});

			serviceUserDetails.findUserWithDetails('123', function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});
});
