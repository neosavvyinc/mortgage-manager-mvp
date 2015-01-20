'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    User = require('../models/model-user'),
    LenderActions = require('../actions/action-lender'),
    _newLender = {};

var LenderStore = Reflux.createStore({

    listenables: LenderActions,

    onNewLender: function(email){
        _newLender.email = email;
        this.trigger();
    },

    onNewPassword: function(password){
        _newLender.password = password;
        this.trigger();
    },

    onSubmitBasicInfo: function(basicInfo){
        _newLender.basicInfo = basicInfo;
    }
});

module.exports = LenderStore;
