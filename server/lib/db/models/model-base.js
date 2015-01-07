'use strict';

var _ = require('underscore'),
	mongoose = require('mongoose/'),
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
 * Finds documents in a collection based on conditions specified
 * @param conditions
 * @param success
 * @param failure
 */
base.retrieve = function(conditions, success, failure) {
	mongooseModel.find(conditions, function(err, docs) {
		if(err) {
			failure('Retrieve: Attempt to find documents with conditions ' + conditions + ' in ' + this.collection + ' failed');
		} else {
			success(docs);
		}
	});
};

/**
 * Function that updates a document in a collection.
 * @param item{Object} - object that has to be persisted into mongo
 * @param conditions{Object} - conditions to search for existing record in mongo
 * @param success
 * @param failure
 */
base.update = function(item, conditions, success, failure) {
	mongooseModel.findOneAndUpdate(conditions, item, function(err) {
		if(err) {
			failure('Update: Attempt to update '+ this.collection + ' failed: ' + err.message);
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
	var docs = {};
	//Find existing documents with the item id
	base.retrieve({_id: item._id}, function(documents) {
		docs = documents;
	}, failure);

	if(!_.isEmpty(docs)) {
		failure('Insert: Document with id ' + item._id + 'exists already in '+ this.collection);
	} else {
		var objectToSave = new mongooseModel(item);
		objectToSave.save(function(err) {
			if(err) {
				failure('Insert: Attempt to save document with id ' + item._id + ' in ' + this.collection + ' failed');
			} else {
				success();
			}
		});
	}
};

/**
 * Function that removes a document from a collection
 * @param item
 * @param success
 * @param failure
 */
base.remove = function(item, success, failure) {
	var docs = {};
	//Find existing documents with the item id
	base.retrieve({_id: item._id}, function(documents) {
		docs = documents;
	}, failure);

	if(_.isEmpty(docs)) {
		failure('Remove: Document with id ' + item._id + ' does not exist in '+ this.collection);
	} else {
		var objectToRemove = new mongooseModel(item);
		objectToRemove.remove(function(err) {
			if(err) {
				failure('Remove: Attempt to Remove document with id ' + item._id + ' in ' + this.collection + ' failed');
			} else {
				success();
			}
		});
	}
};