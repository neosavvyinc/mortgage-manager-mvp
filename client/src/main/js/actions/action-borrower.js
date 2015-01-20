var React = require('react');
var Reflux = require('reflux');

var BorrowerActions = Reflux.createActions([
    "newBorrower",
    "newPassword",
    "submitQuestions",
    "changeBorrowerType",
    "submitBasicInfo",
    "resetBorrower"
]);

module.exports = BorrowerActions;
