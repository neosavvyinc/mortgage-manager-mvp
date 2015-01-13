var React = require('react');
var Reflux = require('reflux');

var BorrowerActions = Reflux.createActions([
    'newBorrower',
    'newPassword',
    "submitQuestions"
]);

module.exports = BorrowerActions;
