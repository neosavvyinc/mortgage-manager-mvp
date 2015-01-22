var Reflux = require('reflux');
var User = require('../models/model-user');
var LenderActions = require('../actions/action-lender');

var _newLender = {};

var LenderStore = Reflux.createStore({
    listenables: LenderActions

});

module.exports = LenderStore;
