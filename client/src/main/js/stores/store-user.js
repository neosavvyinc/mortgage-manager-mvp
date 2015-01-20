var React = require('react');
var Reflux = require('reflux');

var UserActions = require('../actions/action-user');

var _currentUser = {};
var _isAuthenticated = false;

var UserStore = Reflux.createStore({

    listenables: UserActions,
    /*
    // Or:
    init: function(){

        this.listenToMany(UserActions);

        // Same as:
        this.listenTo(UserActions.login, this.onLogin);
        this.listenTo(UserActions.logout, this.onLogout);

    },
    */

    onLogin: function(user) {
        _currentUser = user;
        _isAuthenticated = true;
        this.trigger();
    },

    onLogout: function(){
        _currentUser = {};
        _isAuthenticated = false;
        this.trigger();
    },

    isAuthenticated: function(){
        return _isAuthenticated;
    },

    getCurrentUser: function(){
        return _currentUser;
    }

});

module.exports = UserStore;
