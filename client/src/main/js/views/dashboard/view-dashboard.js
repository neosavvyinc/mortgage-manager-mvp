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
				        transition.redirect('welcome');
			        }
		        })
	        );
        }
    },

	componentDidMount: function() {
		User.checkTrialExpired(UserStore.getCurrentUserId()).then(
			function() {},
			function(error) {
				if(error.message === 'Trial Expired') {
					this.transitionTo('trialExpired');
				}
			}.bind(this));
	},

    render: function(){
        return (
            <span>
                <div className="dashboard-fill" style={{backgroundColor:'white'}}>
                    <div className="header">
                        <Header />
                    </div>
                    <div className="dashboard-body">
                        <RouterHandler />
                    </div>
                    <div className="push" />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        )
    }
});

module.exports = Dashboard;
