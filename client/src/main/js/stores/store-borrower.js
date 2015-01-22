var Reflux = require('reflux');

var User = require('../models/model-user');
var BorrowerActions = require('../actions/action-borrower');

var _borrower = {};
var _borrowerType = "Applicant";

var BorrowerStore = Reflux.createStore({

    listenables: BorrowerActions,

    onNewBorrower: function(email){
        _borrower.email = email;
        this.trigger();
    },

    onNewPassword: function(password){
        _borrower.password = password;
        this.trigger();
    },

    onSubmitQuestions: function (hasCoapplicant, isSelfEmployed){
        _borrower.hasCoapplicant =  hasCoapplicant;
        _borrower.isSelfEmployed = isSelfEmployed;
        this.trigger();
    },

    onChangeBorrowerType: function(newType){
        _borrowerType = newType;
        this.trigger();
    },

    onSubmitBasicInfo: function(basicInfo){
        _borrower.basicInfo = basicInfo;
    },

    onResetBorrower: function(){
        _borrower = {};
        _borrowerType = "Applicant";
        this.trigger();
    },

    getBorrower: function(){
        return _borrower;
    },

    getBorrowerType: function(){
        return _borrowerType
    }

});

module.exports = BorrowerStore;
