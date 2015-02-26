'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var Settings = require('./header-settings');
var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var PaymentStore = require('../stores/store-payment');


var Header = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
	    Reflux.listenTo(PaymentStore, 'onPremium')
    ],

	getInitialState: function() {
		return {
			premiumClass: 'hidden',
			settingsClass: 'col-xs-8'
		};
	},

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(
			function(user) {
				if(user.type === 'borrower' && user.pricingPlan === 'premium') {
					this.onPremium();
				}
			}.bind(this)
		);
	},

	onPremium: function() {
		this.setState({
			premiumClass: 'col-xs-7 green',
			settingsClass: 'col-xs-1'
		});
	},

    render: function() {
        return (
            <div className="navbar navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header page-scroll col-xs-4">
                        <div className="navbar-brand page-scroll pointer">ShuttleDoc</div>
                    </div>
	                <div className={this.state.premiumClass}>
		                <div className="nav navbar-nav pull-right">
			                <div className="navbar-brand page-scroll pointer">Premium</div>
		                </div>
	                </div>
	                <div className={this.state.settingsClass}>
                        <div className="nav navbar-nav pull-right">
                            <Settings/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Header;