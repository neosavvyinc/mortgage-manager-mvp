'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../../models/model-user');
var MessageBox = require('../../components/message-box');
var UserStore = require('../../stores/store-user');

var NewPassword = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation,
		Reflux.listenTo(UserStore, 'onNewAccount')
	],

	getInitialState: function() {
		return {
			token: this.getQuery().token,
			passwordError: false,
			messageText: '',
			messageType: 'error',
			updatedPassword: false
		};
	},

	onUpdatedPassword: function() {
		this.transitionTo('welcome');
	},

	onCheckPassword: function(){
		var newPassword = this.refs.newPassword.getDOMNode().value,
			confirmPassword = this.refs.confirmPassword.getDOMNode().value;
		if(newPassword !== confirmPassword) {
			this.setState({
				passwordError: true,
				messageText: 'Passwords do not match',
				messageType: 'error'
			});
		} else {
			if(this.state.token) {
				User.updatePassword(this.getQuery().uid, newPassword, this.state.token).then(function() {
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
					<h1>Please enter your new password</h1>
					<div className="one fourth">
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

module.exports = NewPassword;
