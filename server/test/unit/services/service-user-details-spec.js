'use strict';

var serviceUserDetails = require('../../../lib/services/service-user-details'),
	userDetailsModel = require('../../../lib/db/models/model-user-details').Model,
	userModel = require('../../../lib/db/models/model-user').Model,
	baseModel = require('../../../lib/db/models/model-base').Model;

describe('serviceUserDetails', function() {
	var userInsertSpy,
		userDetailsInsertSpy;

	beforeEach(function () {
		userInsertSpy = spyOn(userModel.prototype, 'insertOrUpdate');
		userDetailsInsertSpy = spyOn(userDetailsModel.prototype, 'insertOrUpdate');
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
				expect(obj).toEqual({email: 'bar', password: '123', type:'borrower'});
				failure('coapplicant user insert failed');
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: '123', type:'borrower'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('coapplicant user insert failed');
			});
		});

		it('should fail if userDetailsModel.insertOrUpdate fails while creating coapplicant', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect(obj).toEqual({email: 'bar', password: '123', type:'borrower'});
				success({_id: '222'});
			});

			userDetailsInsertSpy.andCallFake(function(obj, success, failure) {
				expect(obj).toEqual({_id: '222'});
				failure('coapplicant details insert failed');
			});

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: '123', type:'borrower'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('coapplicant details insert failed');
			});
		});

		it('should fail if userDetailsModel.insertOrUpdate fails while updating user with coapplicant id', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect(obj).toEqual({email: 'bar', password: '123', type:'borrower'});
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

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: '123', type:'borrower'}, function() {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('user details update failed');
			});
		});

		it('should succeed if all insertOrUpdate functions succeed', function() {
			userInsertSpy.andCallFake(function(obj, conditions, success, failure) {
				expect(obj).toEqual({email: 'bar', password: '123', type:'borrower'});
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

			serviceUserDetails.createCoApplicant('123', {email: 'bar', password: '123', type:'borrower'}, function() {
				expect().toHaveExecuted();
			},
			function(error) {
				expect().toHaveNotExecuted('Should not have failed');
			});
		});
	});
});
