var React = require('react');
var Reflux = require('reflux');
var User = require('../models/model-user');
var UserActions = require('../actions/action-user');

var _currentUser = {};
var _newUser = {};

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
        User.login(email, password).then(function(){
            _currentUser.email = email;
            _currentUser.password = password;
            console.log("::: current user :::",_currentUser);
            this.trigger();
        }, function(){
            _currentUser = {};
            this.trigger();
        });
    },

    onLogout: function(){
        _currentUser = {};
        this.trigger();
    },

    onAddLender: function(email){
        _newUser.email = email;
        _newUser.type = "Lender";
        this.trigger();
    },

    onAddBorrower: function(email){
        _newUser.email = email;
        _newUser.type = "Borrower";
        this.trigger();
    },

    isAuthenticated: function(){
        return _currentUser.email && _currentUser.password;
    },

    getCurrentUser: function(){
        return _currentUser;
    }

});

module.exports = UserStore;
