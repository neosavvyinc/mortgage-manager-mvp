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
			continueClass: 'btn btn-md btn-primary col-xs-12',
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
					loginClass: 'btn btn-md btn-primary col-xs-12',
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
                        <h1 className="col-xs-12 bordered-bottom"><i className="fa fa-chevron-left pointer" onClick={this.back}></i> Change your password</h1>
                    </div>
                </div>
                <div className="row double-gap-top">
                    <div className="col-xs-12 col-sm-6 col-md-4 col-sm-offset-3">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="form-group">
                                    <input className="form-control" type="password" ref="oldPassword" placeholder="Old Password" />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="password" ref="newPassword" placeholder="New Password" />
                                </div>
                                <div className="form-group">
                                    <input className="form-control" type="password" ref="confirmPassword" placeholder="Confirm Password"/>
                                </div>
                                <MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
                                <button className={this.state.continueClass} onClick={this.onCheckPassword}>Continue</button>
                                <button className={this.state.loginClass} onClick={this.onUpdatedPassword}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
});

module.exports = ChangePassword;
