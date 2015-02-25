'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux');

var PaymentSuccess = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	close: function(e) {
		if(e) {
			e.preventDefault();
		}
		this.transitionTo('dashboardApplications');
	},

	onUpgrade: function(e) {
		e.preventDefault();
		this.transitionTo('pricingOptions');
	},

	render: function() {
		return (
			<div>
				<form className="uploadComponent">
					<div onClick={this.close} title="Close" className="close">X</div>
					<legend><h1>Your Payment was successful!</h1></legend>
					<div className="row">
						Thank you for your support. You can now access all the premium features.
					</div>
					<div className="row">
						<button className="one third red block gap-right gap-bottom gap-top" onClick={this.close}>Close</button>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = PaymentSuccess;