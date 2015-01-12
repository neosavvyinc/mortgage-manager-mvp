var React = require('react');
var Reflux = require('reflux');
var User = require('../models/model-user');
var BorrowerActions = require('../actions/action-borrower');

var _newBorrower = {};

var BorrowerStore = Reflux.createStore({

    listenables: BorrowerActions

});

module.exports = BorrowerStore;
