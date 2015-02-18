'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Pricing = require('../../components/pricing');


var PricingOptions = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	render: function() {
		return (
			<div className="container gap-top align-center">
				<h1>Pricing</h1>
				<div className="one third">
					<Pricing name="Monthly" rate="35"/>
				</div>
				<div className="one third">
					<Pricing name="Three months" rate="100"/>
				</div>
				<div className="one third">
					<Pricing name="Six months" rate="200"/>
				</div>
			</div>
		);
	}
});

module.exports = PricingOptions;