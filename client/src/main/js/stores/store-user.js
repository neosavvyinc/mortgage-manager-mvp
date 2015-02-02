var Reflux = require('reflux');

var UserActions = require('../actions/action-user');

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
        localStorage.setItem("userId", user._id);
        this.trigger();
    },

    onLogout: function(){
        localStorage.removeItem("userId");
        this.trigger();
    },

    isAuthenticated: function(){
        return (localStorage.getItem("userId") != undefined);
    },

    getCurrentUserId: function(){
        return localStorage.getItem("userId");
    }
});

module.exports = UserStore;
