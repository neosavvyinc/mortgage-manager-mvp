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
        sessionStorage.setItem("userId", user._id);
        this.trigger();
    },

    onLogout: function(){
        sessionStorage.removeItem("userId");
        this.trigger();
    },

    getCurrentUserId: function(){
        return sessionStorage.getItem("userId");
    }
});

module.exports = UserStore;
