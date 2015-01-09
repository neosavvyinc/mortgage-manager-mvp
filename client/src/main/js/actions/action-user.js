var React = require('react');
var Reflux = require('reflux');

var UserActions = Reflux.createActions([
    'login',
    'logout',
    'addLender',
    'addBorrower'
]);

module.exports = UserActions;
