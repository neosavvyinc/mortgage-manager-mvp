'use strict';

var React = require('react'),
	Router = require('react-router'),
	MessageBox = require('../../components/message-box'),
	User = require('../../models/model-user');

var ForgotPassword = React.createClass({

	mixins: [
		Router.State
	],

	getInitialState: function() {
		return {
			display: false,
			disabled: false
		};
	},

	onValidateEmail: function() {
		var email = this.refs.email.getDOMNode().value;
		if(email) {
			User.forgotPassword(email).then(
				function() {
					this.setState({
						display: true,
						displayText: 'Email sent! Follow instructions on the email to reset your password.',
						type: 'success',
						disabled: true
					});
				}.bind(this),
				function(error) {
					this.setState({
						display: true,
						displayText: error.responseJSON.message,
						type: 'error'
					});
				}.bind(this)
			);
		}
	},

	render: function() {
		return (
                <div className="container">
                    <div className="row">
                        <h1 className="col-xs-12 bordered-bottom">Enter your email. We will send you a link to reset your password.</h1>
                    </div>
                    <div className="row double-gap-top">
                        <div className="col-xs-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <div className="form-group form-group-lg">
                                        <label className="label-lg">Email</label>
                                        <input className="form-control" type="text" ref="email" placeholder="Enter your email" />
                                    </div>
                                    <MessageBox displayMessage={this.state.display} message={this.state.displayText} type={this.state.type} />
                                    <button className="btn btn-lg btn-dark-blue col-xs-12" onClick={this.onValidateEmail} disabled={this.state.disabled}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
		)
	}
});

module.exports = ForgotPassword;