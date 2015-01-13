var React = require('react');
var Reflux = require('reflux');

var User = require('../models/model-user');
var BorrowerActions = require('../actions/action-borrower');

var _borrower = {};

var _isAjaxError = false; // Note: Another way to do it would be to this.trigger({ajax-result});

var BorrowerStore = Reflux.createStore({

    listenables: BorrowerActions,

    onNewBorrower: function(email){
        _borrower.email = email;
        _borrower.type = "applicant";
        this.trigger();
    },

    onNewPassword: function(password){
        _borrower.password = password;
        User.register(_borrower).then(function(){
            _isAjaxError = false;
            this.trigger();
        }.bind(this), function(){
            _isAjaxError = true;
            this.trigger();
        }.bind(this));
    },

    getBorrower: function(){
        return _borrower;
    },

    isAjaxError: function(){
        return _isAjaxError;
    }

});

module.exports = BorrowerStore;
