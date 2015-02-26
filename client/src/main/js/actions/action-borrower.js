var Reflux = require('reflux');

var BorrowerActions = Reflux.createActions([
    "newBorrower",
    "newPassword",
    "submitQuestions",
    "changeBorrowerType",
    "submitBasicInfo",
    "resetBorrower",
    "addCoapplicant"
]);

module.exports = BorrowerActions;
