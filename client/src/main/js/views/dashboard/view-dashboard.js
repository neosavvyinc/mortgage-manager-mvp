'use strict';

var React = require('react');
var Router = require('react-router');
var RouterHandler = require('react-router').RouteHandler;
var Reflux = require('reflux');

var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');
var UserActions = require('../../actions/action-user');
var Header = require('../../components/header');
var Footer = require('../../components/footer');
var moment = require('moment');

var Dashboard = React.createClass({

    mixins: [
        Router.State,
	    Router.Navigation,
	    Reflux.listenTo(UserStore, 'onTrialExpired')
    ],

    statics: {
        willTransitionTo: function (transition){
	        transition.wait(
		        User.isAuthenticated().then(function (res) {
			        if (!res.isAuthenticated) {
				        transition.redirect('welcome');
			        }
		        })
	        );
        }
    },

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(function(res) {
			var createdDate = moment(res.created);

			User.getCurrentUser().then(function(user) {
				UserActions.receiveCurrentUser(user, createdDate);
			}.bind(this));
		}.bind(this));
	},

	onTrialExpired: function() {
		this.transitionTo('trialExpired');
	},

    render: function(){
        return (
            <div>
                <Header />
                <RouterHandler />
                <Footer />
            </div>
        )
    }
});

module.exports = Dashboard;
