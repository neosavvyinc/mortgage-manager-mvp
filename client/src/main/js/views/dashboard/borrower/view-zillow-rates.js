'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var ZillowRates = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function(){
		return {
			nothing: true
		};
	},


	render: function(){
		return (
			<div className="container">
				<div className="row">
					<div className="one third">
						<h1 className="col-xs-12 bordered-bottom"><i className="fa fa-chevron-left pointer" onClick={this.back}></i> Zillow Rates </h1>
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
								<div className="alert alert-info">
									<p>Your password should have at least:</p>
									<ul>
										<li>Eight characters</li>
										<li>One lower case</li>
										<li>One upper case</li>
										<li>One special character (!@#~$%^&)</li>
									</ul>
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

module.exports = ZillowRates;
