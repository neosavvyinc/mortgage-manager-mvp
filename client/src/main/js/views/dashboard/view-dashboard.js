'use strict';

var React = require('react');
var Router = require('react-router');
var RouterHandler = require('react-router').RouteHandler;
var Reflux = require('reflux');

var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');

var Header = require('../../components/header');
var Footer = require('../../components/footer');

var moment = require('moment');

var Dashboard = React.createClass({

    mixins: [
        Router.State,
	    Router.Navigation
    ],

    statics: {
        willTransitionTo: function (transition){
	        transition.wait(
		        User.isAuthenticated().then(function (res) {
			        if (!res.isAuthenticated) {
				        console.log('Here not authenticated');
				        transition.redirect('welcome');
			        }
		        })
	        );
        }
    },

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(function(user) {
			var createdDate = moment(user.created),
				currentDate = moment(),
				duration = moment.duration(currentDate.diff(createdDate));

			if(user.type === 'borrower' && user.pricingPlan === 'trial' && duration.asDays() > 15) {
				this.transitionTo('trialExpired');
			}
		}.bind(this));
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
