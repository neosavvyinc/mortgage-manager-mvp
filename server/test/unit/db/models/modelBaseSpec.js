'use strict';

var _ = require('underscore'),
	baseModel = require('../../../../lib/db/models/model-base').Model,
	mongoose = require('mongoose/'),
	schemas = require('../../../../lib/db/schemas');

describe('modelBase', function() {
	var base;

	beforeEach(function() {
		base = new baseModel('user', schemas.Schemas.UserSchema);
	});

	describe('findDocumentById', function() {
		var modelFindSpy;

		beforeEach(function() {
			modelFindSpy = spyOn(mongoose.Model, 'findById');
		});

		it('should fail if model.findById fails', function() {
			modelFindSpy.andCallFake(function(id, callback) {
				callback(new Error('fail'));
			});

			base.findDocumentById('1', function(docs) {
				expect().toHaveNotExecuted('Should not have succeeded');
			},
			function(error) {
				expect(error).toBe('Could not find document with specified id: Error: fail');
			});
		});

		it('should succeed with no documents if id is not found in mongo', function() {
			modelFindSpy.andCallFake(function(id, callback) {
				callback(null, []);
			});

			base.findDocumentById('1', function(docs) {
					expect(_.size(docs)).toBe(0);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});

		it('should succeed with one document if id is found in mongo', function() {
			modelFindSpy.andCallFake(function(id, callback) {
				if(id === '1') {
					callback(null, [{_id: 1, first: 'first'}]);
				}
			});

			base.findDocumentById('1', function(docs) {
					expect(_.size(docs)).toBe(1);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});

	describe('retrieve', function() {
		var modelFindSpy;

		beforeEach(function() {
			modelFindSpy = spyOn(mongoose.Model, 'find');
		});

		it('should fail if model.find fails', function() {
			modelFindSpy.andCallFake(function(conditions, callback) {
				callback(new Error('fail'));
			});

			base.retrieve('1', function(docs) {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('Retrieve: Attempt to find documents for specified conditions failed: Error: fail');
				});
		});

		it('should succeed if documents are found in mongo', function() {
			modelFindSpy.andCallFake(function(conditions, callback) {
				callback(null, [{_id: 1, first: 'first'}]);
			});

			base.retrieve('1', function(docs) {
					expect(_.size(docs)).toBe(1);
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});

	describe('update', function() {
		var modelFindSpy;

		beforeEach(function() {
			modelFindSpy = spyOn(mongoose.Model, 'findOneAndUpdate');
		});

		it('should fail if model.findOneAndUpdate fails', function() {
			modelFindSpy.andCallFake(function(conditions, update, options, callback) {
				callback(new Error('fail'));
			});

			base.update({foo: 'foo'}, null, null, function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('Update: Attempt to update failed: fail');
				});
		});

		it('should succeed if documents are found in mongo', function() {
			modelFindSpy.andCallFake(function(conditions, update, options, callback) {
				callback();
			});

			base.update({foo: 'foo'}, null, null, function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});
});