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

	describe('insert', function() {
		var modelSaveSpy,
			ModelObject = mongoose.model('user', schemas.Schemas.UserSchema),
			dummyModelObject,
			item = {dummy: 'dummy'};

		beforeEach(function() {
			dummyModelObject = new ModelObject(item);
			spyOn(baseModel.prototype, '_createModelObject').andCallFake(function() {
				return dummyModelObject;
			});
			modelSaveSpy = spyOn(dummyModelObject, 'save');
		});

		it('should fail if model.save fails', function() {
			modelSaveSpy.andCallFake(function(callback) {
				callback(new Error('fail'));
			});

			base.insert(item, function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('Insert: Attempt to save document {"dummy":"dummy"} failed: Error: fail');
				});
		});

		it('should succeed if model.save succeed', function() {
			modelSaveSpy.andCallFake(function(callback) {
				callback(null);
			});

			base.insert(item, function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});

	describe('remove', function() {
		var modelRemoveSpy,
			ModelObject = mongoose.model('user', schemas.Schemas.UserSchema),
			dummyModelObject,
			item = {dummy: 'dummy'};

		beforeEach(function() {
			dummyModelObject = new ModelObject(item);
			spyOn(baseModel.prototype, '_createModelObject').andCallFake(function() {
				return dummyModelObject;
			});
			modelRemoveSpy = spyOn(dummyModelObject, 'remove');
		});

		it('should fail if model.save fails', function() {
			modelRemoveSpy.andCallFake(function(callback) {
				callback(new Error('fail'));
			});

			base.remove(item, function() {
					expect().toHaveNotExecuted('Should not have succeeded');
				},
				function(error) {
					expect(error).toBe('Remove: Attempt to remove document {"dummy":"dummy"} failed: Error: fail');
				});
		});

		it('should succeed if model.save succeed', function() {
			modelRemoveSpy.andCallFake(function(callback) {
				callback(null);
			});

			base.remove(item, function() {
					expect().toHaveExecuted();
				},
				function(error) {
					expect().toHaveNotExecuted('Should not have failed');
				});
		});
	});

	describe('_createModelObject', function() {
		it('should return a model object for a particular item', function() {
			var  item = {dummy: 'dummy'};
			var modelObject = base._createModelObject(item);
			expect(typeof modelObject).toBe('object');
		});
	});
});