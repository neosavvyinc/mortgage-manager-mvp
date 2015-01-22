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
        localStorage.setItem("userId", user._id);
        this.trigger();
    },

    onLogout: function(){
        _currentUser = {};
        localStorage.removeItem("userId");
        console.log("local storage", localStorage.removeItem("userId"));
        this.trigger();
    },

    isAuthenticated: function(){
        return (localStorage.getItem("userId") != undefined);
    },

    getCurrentUser: function(){
        return localStorage.getItem("userId");
    }

});

module.exports = UserStore;
