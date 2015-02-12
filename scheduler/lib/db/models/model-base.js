'use strict';

var base,
	mongoose = require('mongoose/');

function BaseModel(){ }

base = BaseModel.prototype;

/**
 * Initializes the base mongoose model
 * @param collection
 * @param schema
 */
base.init = function (collection, schema){
	this.mongooseModel = mongoose.model(collection, schema);
};

/**
 * Finds a document in the model by id
 * @param id
 * @param success
 * @param failure
 */
base.findDocumentById = function(id, success, failure) {
	this.mongooseModel.findById(id, function(err, doc) {
		if(err) {
			failure('Could not find document with specified id: ' + err);
		} else {
			success(doc);
		}
	});
};

/**
 * Finds one document based on conditions
 * @param conditions
 * @param success
 * @param failure
 */
base.findOneDocument = function(conditions, success, failure) {
	base.retrieve.bind(this)(conditions, function(docs) {
		if(docs.length === 1) {
			success(docs[0]);
		} else if(docs.length < 1) {
			failure('Error: No documents found');
		} else {
			failure('Error: More than 1 document found');
		}
	}, failure);
};

/**
 * Finds documents in a collection based on conditions specified
 * @param conditions
 * @param success
 * @param failure
 */
base.retrieve = function(conditions, success, failure) {
	this.mongooseModel.find(conditions, function(err, docs) {
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
	this.mongooseModel.findOneAndUpdate(conditions, update, options, function(err) {
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
	var objectToSave = base._createModelObject(this, item);
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
	var objectToRemove = base._createModelObject(this, item);
	objectToRemove.remove(function(err) {
		if(err) {
			failure('Remove: Attempt to remove document ' + JSON.stringify(item) + ' failed: '+ err);
		} else {
			success();
		}
	});
};

/* Private methods */
/**
 * Function that returns a mongoose model object.
 * @param self
 * @param item
 * @returns {mongooseModel}
 * @private
 */
base._createModelObject = function(self, item) {
	return new self.mongooseModel(item);
};


exports.Model = BaseModel;