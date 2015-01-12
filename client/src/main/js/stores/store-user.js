var React = require('react');
var Reflux = require('reflux');
var User = require('../models/model-user');
var UserActions = require('../actions/action-user');

var _currentUser = {};
//var _newUser = {};

var UserStore = Reflux.createStore({

    listenables: UserActions,

    /*
    // Or:
    init: function(){

        this.listenToMany(UserActions);

        // Same as:
        this.listenTo(UserActions.login, this.onLogin);
        this.listenTo(UserActions.logout, this.onLogout);
        this.listenTo(UserActions.addLender, this.onAddLender);
        this.listenTo(UserActions.addBorrower, this.onAddBorrower);

    },
    */

    onLogin: function(email, password){
        var self = this;
        User.login(email, password).then(function(){
            _currentUser.email = email;
            _currentUser.password = password;
            self.trigger();
        }, function(){
            _currentUser = {};
            self.trigger();
        });
    },

    onLogout: function(){
        _currentUser = {};
        this.trigger();
    },

    isAuthenticated: function(){
        return (_currentUser.email && _currentUser.password);
    },

    getCurrentUser: function(){
        console.log("getting current user...");
        return _currentUser;
    }

});

module.exports = UserStore;
