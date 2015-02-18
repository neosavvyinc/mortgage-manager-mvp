'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var Location = Router.HistoryLocation;

var User = require('../../models/model-user');
var MessageBox = require('../../components/message-box');
var UserStore = require('../../stores/store-user');

var ChangePassword = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function() {
		return {
			passwordError: false,
			messageText: '',
			messageType: 'error',
			continueClass: 'block turquoise',
			loginClass: 'hidden'
		};
	},

	back: function() {
		this.transitionTo('dashboardApplications');
	},

	onUpdatedPassword: function() {
		this.transitionTo('welcome');
	},

	onCheckPassword: function(){
		var oldPassword = this.refs.oldPassword.getDOMNode().value,
			newPassword = this.refs.newPassword.getDOMNode().value,
			confirmPassword = this.refs.confirmPassword.getDOMNode().value;

		if(newPassword !== confirmPassword) {
			this.setState({
				passwordError: true,
				messageText: 'Passwords do not match',
				messageType: 'error'
			});
		} else {
			User.updatePassword(UserStore.getCurrentUserId(), oldPassword, newPassword, null).then(function() {
				this.setState({
					passwordError: true,
					messageText: 'Password successfully updated. Click below to login',
					messageType: 'success',
					loginClass: 'block turquoise',
					continueClass: 'hidden'
				});
			}.bind(this), function(error) {
				this.setState({
					passwordError: true,
					messageText: error.responseJSON.message,
					messageType: 'error'
				});
			}.bind(this));
		}
	},

	render: function() {
		return (
			<div className="container">
                <div className="row">
                    <div className="one third">
                        <h1><span className="tooltip" data-tooltip="Back"><i className="fa fa-chevron-left pointer" onClick={this.back}></i></span> Change your password</h1>
                    </div>
                </div>
                <div className="row divBorder">
                    <div className="one third gap-top gap-bottom">
                        <input className="gap-bottom" type="password" ref="oldPassword" placeholder="Old Password" />
                        <input className="gap-bottom" type="password" ref="newPassword" placeholder="New Password" />
                        <input className="gap-bottom" type="password" ref="confirmPassword" placeholder="Confirm Password"/>
                        <MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
                        <button className={this.state.continueClass} onClick={this.onCheckPassword}>Continue</button>
	                    <button className={this.state.loginClass} onClick={this.onUpdatedPassword}>Login</button>
                    </div>
                </div>
			</div>
		);
	}
});

module.exports = ChangePassword;
