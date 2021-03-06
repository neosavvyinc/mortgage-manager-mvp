'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var UserActions = require('../actions/action-user');

var PaymentStore = require('../stores/store-payment');

var HeaderNav = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation,
		Reflux.listenTo(UserStore, 'onLogoutTransition'),
		Reflux.listenTo(PaymentStore, 'onPremium')
	],

	getInitialState: function() {
		return {
			isTrial: false,
            displayDropdown: false
		};
	},

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(function (user) {
			if (user.type === 'borrower' && user.pricingPlan === 'trial') {
				this.setState({isTrial: true, userType: 'borrower'});
			}
		}.bind(this));
	},

	onLogout: function(){
		User.logOut().then(function() {
			UserActions.logout();
		});
	},

	onPremium: function() {
		this.setState({
			isTrial: false,
			upgraded: true
		});
	},

	onLogoutTransition: function() {
        this.resetToggle();
		this.transitionTo('welcome');
	},

	onChangePassword: function() {
        this.resetToggle();
		this.transitionTo('changePassword');
	},

	onViewProfile: function() {
        this.resetToggle();
		this.transitionTo('viewProfile');
	},

	onUpgrade: function() {
        this.resetToggle();
        this.transitionTo('pricingOptions');
	},

	onViewPayments: function() {

	},

    resetToggle: function() {
        this.setState({displayDropdown: false});
    },

    onToggleDropdown: function(){
        this.setState({
            displayDropdown: !this.state.displayDropdown
        });
    },

	render: function() {
		var upgradeClass,
			viewPaymentsClass;

		if(this.state.userType === 'borrower') {
			if (this.state.isTrial) {
				upgradeClass = '';
				viewPaymentsClass = 'hidden disabled';
			} else if(this.state.upgraded) {
				upgradeClass = 'hidden disabled';
				viewPaymentsClass = 'hidden disabled';
			} else {
				upgradeClass = 'hidden disabled';
				viewPaymentsClass = '';
			}
		} else {
			upgradeClass = 'hidden disabled';
			viewPaymentsClass = 'hidden disabled';
		}

		return (
            <div className="btn-group">
                <div className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" onClick={this.onToggleDropdown}>
                    <i className="fa fa-gear cog-icon"></i>
                </div>
                <ul className="dropdown-menu pull-right" role="menu" id="dropdown" style={{display: (this.state.displayDropdown ? 'block' : 'none')}}>
                    <li role="presentation" className="pointer"><a onClick={this.onViewProfile}>View Profile</a></li>
                    <li role="presentation" className="pointer"><a onClick={this.onChangePassword}>Change Password</a></li>
                    <li role="presentation" className="pointer"><a onClick={this.onUpgrade} className={upgradeClass}>Upgrade</a></li>
                    <li role="presentation" className="pointer"><a onClick={this.onViewPayments} className={viewPaymentsClass}>View Payments</a></li>
                    <li role="presentation" className="pointer"><a onClick={this.onLogout}>Logout</a></li>
                </ul>
            </div>
		);
	}
});

module.exports = HeaderNav;