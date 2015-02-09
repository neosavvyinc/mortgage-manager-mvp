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
			updatedPassword: false
		};
	},

	back: function() {
		Location.pop();
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
					updatedPassword: true,
					passwordError: true,
					messageText: 'Password successfully updated. Click below to login',
					messageType: 'success'
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
		return this.state.updatedPassword ? (
			<div className="container">
				<div className="gap-top">
					<div className="one fourth">
						<MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
						<button className="block turquoise" onClick={this.onUpdatedPassword}>Login</button>
					</div>
				</div>
			</div>
		) : (
			<div className="container">
				<div className="gap-top">
					<h1><span className="tooltip" data-tooltip="Back"><i className="fa fa-chevron-left pointer" onClick={this.back}></i></span>Update your password</h1>
					<div className="one fourth">
						<input className="gap-bottom" type="password" ref="oldPassword" placeholder="Old Password" />
						<input className="gap-bottom" type="password" ref="newPassword" placeholder="New Password" />
						<input className="gap-bottom" type="password" ref="confirmPassword" placeholder="Confirm Password"/>
						<MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
						<button className="block turquoise" onClick={this.onCheckPassword}>Continue</button>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ChangePassword;
