'use strict';

var Reflux = require('reflux');
var UserActions = require('../actions/action-user');
var User = require ('../models/model-user');
var moment = require('moment');

var currentUser = {};

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
        currentUser = user;
        this.trigger();
    },

    onLogout: function(){
        sessionStorage.removeItem("userId");
        currentUser = {};
        this.trigger();
    },

	onReceiveCurrentUser: function(user, createdDate) {
		var currentDate = moment(),
			duration = moment.duration(currentDate.diff(createdDate));
		if(user.type === 'borrower' && user.pricingPlan === 'trial' && duration.asDays() > 15) {
			this.trigger();
		}
	},

    getCurrentUserId: function(){
        return sessionStorage.getItem("userId");
    },

    getCurrentUser: function(){
        return currentUser;
    }
});

module.exports = UserStore;
