var React = require('react');
var Reflux = require('reflux');

var UserActions = require('../actions/action-user');

var _currentUser = {};

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

    onLogin: function(user){
        _currentUser = user;
        localStorage.setItem("authenticated", true);
        this.trigger();
    },

    onLogout: function(){
        _currentUser = {};
        localStorage.removeItem("authenticated");
        this.trigger();
    },

    isAuthenticated: function(){
        return localStorage.getItem("authenticated");
    },

    getCurrentUser: function(){
        return _currentUser;
    }

});

module.exports = UserStore;
