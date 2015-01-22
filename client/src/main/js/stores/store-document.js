'use strict';

var Reflux = require('reflux'),
	DocumentActions = require('../actions/action-document'),
	_document = [];

var DocumentStore = Reflux.createStore({

	listenables: DocumentActions,

	onUploadDocument: function(document) {
		_document = document;
		this.trigger();
	}
});

module.exports = DocumentStore;
