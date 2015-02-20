'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var UserActions = require('../actions/action-user');

var HeaderNav = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation,
		Reflux.listenTo(UserStore, 'onLogoutTransition')
	],

	getInitialState: function() {
		return {
			isTrial: false
		};
	},

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(function (user) {

			if (user.type === 'borrower' && user.pricingPlan === 'trial') {
				this.setState({isTrial: true});
			}
		}.bind(this));
	},

	onLogout: function(){
		User.logOut().then(function() {
			UserActions.logout();
		});
	},

	onLogoutTransition: function() {
		this.transitionTo('welcome');
	},

	onChangePassword: function() {
		this.transitionTo('changePassword');
	},

	onViewProfile: function() {
		this.transitionTo('viewProfile');
	},

	onUpgrade: function() {
		this.transitionTo('pricingOptions');
	},

	onViewPayments: function() {

	},

	render: function() {
		var upgradeClass,
			viewPaymentsClass;

		if(this.state.isTrial) {
			upgradeClass = '';
			viewPaymentsClass = 'hidden disabled';
		} else {
			upgradeClass = 'hidden disabled';
			viewPaymentsClass = '';
		}

		return (
			<div className = "one whole">
				<nav className="header-nav">
					<ul>
						<li><span className="row"><i className="fa fa-gear one third"></i></span>
							<ul>
								<li><div onClick={this.onViewProfile}>View Profile</div></li>
								<li><div onClick={this.onChangePassword}>Change Password</div></li>
								<li><div onClick={this.onUpgrade} className={upgradeClass}>Upgrade</div></li>
								<li><div onClick={this.onViewPayments} className={viewPaymentsClass}>View Payments</div></li>
								<li><div onClick={this.onLogout}>Logout</div></li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		);
	}
});

module.exports = HeaderNav;