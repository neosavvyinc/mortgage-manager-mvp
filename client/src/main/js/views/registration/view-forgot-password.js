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
			User.emailExists(email).then(
				function() {
					this.setState({
						display: true,
						displayText: 'Email does not exist!',
						type: 'error'
					});
				}.bind(this),
				function(error){
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
								type: 'failure'
							});
						}.bind(this)
					);
				}.bind(this)
			);
		}
	},

	render: function() {
		return (
			<div className="container">
				<div className="gap-top">
					<h1>Enter your email. We will send you a link to reset your password.</h1>
					<div className="one fourth">
						<input className="gap-bottom" type="text" ref="email" placeholder="Enter your email" />
						<MessageBox displayMessage={this.state.display} message={this.state.displayText} type={this.state.type} />
						<button className="block turquoise" onClick={this.onValidateEmail} disabled={this.state.disabled}>Continue</button>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = ForgotPassword;