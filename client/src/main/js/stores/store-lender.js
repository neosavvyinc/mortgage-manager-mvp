'use strict';

var Reflux = require('reflux'),
    _ = require('lodash'),
    User = require('../models/model-user'),
    LenderActions = require('../actions/action-lender'),
    _newLender = {},
    _lenderList = [];

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
    },

    onInviteLender: function(newLender){
        _lenderList.push(newLender);
        this.trigger();
    },

    onSetLenderList: function(lenders){
        _lenderList = lenders;
        this.trigger();
    },

    onRemoveLenderInvite: function(lender){
        _lenderList = _.without(_lenderList, lender);
        this.trigger();
    },

    getLenderList: function(){
        return _lenderList;
    },

    getLender: function(){
        return _newLender;
    },

    onLenderInvite: function(lenderInfo){
        _newLender = {
            email: lenderInfo.email,
            basicInfo: {
                firstName: lenderInfo.firstName,
                lastName: lenderInfo.lastName,
                organization: lenderInfo.organization
            },
            token: lenderInfo.token,
            appId: lenderInfo.appId
        };
        this.trigger();
    }
});

module.exports = LenderStore;
