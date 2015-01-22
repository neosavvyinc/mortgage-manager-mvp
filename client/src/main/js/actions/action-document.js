'use strict';

var Reflux = require('reflux');

var DocumentActions = Reflux.createActions([
	"uploadDocument",
	"deleteDocument",
	"requestDocument"
]);

module.exports = DocumentActions;

