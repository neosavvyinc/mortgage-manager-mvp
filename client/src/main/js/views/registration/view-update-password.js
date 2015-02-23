'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../../models/model-user');
var MessageBox = require('../../components/message-box');
var UserStore = require('../../stores/store-user');

var UpdatePassword = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation,
		Reflux.listenTo(UserStore, 'onNewAccount')
	],

	getInitialState: function() {
		return {
            //token: this.getQuery().token,
            token: "1234",
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
				User.updatePassword(this.getQuery().uid, null, newPassword, this.state.token).then(function() {
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
            <div className="bg-color fill">
                <div className="container container-color fill">
                    <div className="row">
                        <div className="one fourth">
                            <MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
                            <button className="btn btn-lg btn-primary col-xs-12" onClick={this.onUpdatedPassword}>Login</button>
                        </div>
                    </div>
				</div>
			</div>
		) : (
            <div className="bg-color fill">
                <div className="container container-color fill">
                    <div className="row">
                        <h1 className="col-xs-12 bordered-bottom">Please enter your new Password</h1>
                    </div>
                    <div className="row double-gap-top">
                        <div className="col-xs-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input className="form-control" type="password" ref="newPassword" placeholder="New Password" />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input className="form-control" type="password" ref="confirmPassword" placeholder="Confirm Password"/>
                                    </div>
                                    <MessageBox displayMessage={this.state.passwordError} message={this.state.messageText} type={this.state.messageType} />
                                    <button className="btn btn-lg btn-primary col-xs-12" onClick={this.onCheckPassword}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = UpdatePassword;
