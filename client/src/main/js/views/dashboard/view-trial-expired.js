'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Location = Router.HistoryLocation;

var TrialExpired = React.createClass({

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
						<legend><h1>You Trial Period has expired</h1></legend>
						<div className="row">
							Please help us to continue to support you and make your mortgage process a lot less painstaking.
							If you choose to continue on the trial version, you will not be able to use premium features.
						</div>
						<div className="row">
							<button className="one third red block gap-right gap-bottom gap-top" onClick={this.close}>Close</button>
							<button className="one third green block gap-right gap-bottom gap-top" onClick={this.onUpgrade}>Upgrade</button>
						</div>
					</form>
				</div>
			);
	}
});

module.exports = TrialExpired;
