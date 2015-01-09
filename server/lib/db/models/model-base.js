'use strict';

var mongoose = require('mongoose/'),
	mongooseModel,
	base;

/**
 * Constructor for base model class
 * @param collection
 * @param schema
 */
function BaseModel(collection, schema) {
	this.collection = collection;
	this.schema = schema;
	mongooseModel = mongoose.model(collection, schema);
}

base = BaseModel.prototype;

/**
 * Finds a document in the model by id
 * @param id
 * @param success
 * @param failure
 */
base.findDocumentById = function(id, success, failure) {
	mongooseModel.findById(id, function(err, doc) {
		if(err) {
			failure('Could not find document with specified id: ' + err);
		} else {
			success(doc);
		}
	});
};

/**
 * Finds documents in a collection based on conditions specified
 * @param conditions
 * @param success
 * @param failure
 */
base.retrieve = function(conditions, success, failure) {
	mongooseModel.find(conditions, function(err, docs) {
		if(err) {
			failure('Retrieve: Attempt to find documents for specified conditions failed: ' + err);
		} else {
			success(docs);
		}
	});
};

/**
 * Function that updates a document in a collection.
 * @param update{Object} - Changes in document that have to be persisted
 * @param conditions{Object} - conditions to search for existing record
 * @param options
 * @param success
 * @param failure
 */
base.update = function(update, conditions, options, success, failure) {
	mongooseModel.findOneAndUpdate(conditions, update, options, function(err) {
		if(err) {
			failure('Update: Attempt to update failed: ' + err.message);
		} else {
			success();
		}
	});
};

/**
 * Function that inserts a document into a collection
 * @param item
 * @param success
 * @param failure
 */
base.insert = function(item, success, failure) {
	var objectToSave = new mongooseModel(item);
	objectToSave.save(function(err) {
		if(err) {
			failure('Insert: Attempt to save document ' + JSON.stringify(item) + ' failed: '+err);
		} else {
			success();
		}
	});
};

/**
 * Function that removes a document from a collection
 * @param item
 * @param success
 * @param failure
 */
base.remove = function(item, success, failure) {
	var objectToRemove = new mongooseModel(item);
	objectToRemove.remove(function(err) {
		if(err) {
			failure('Remove: Attempt to Remove document with id ' + item._id + ' failed');
		} else {
			success();
		}
	});
};

exports.Model = BaseModel;