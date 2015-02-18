'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var Pricing = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	onChoosePrice: function() {
		this.transitionTo('stripePayment', {price: this.props.rate});
	},

	render: function() {
		return (
			<div className="container">
				<div className="row">
					<h2>{this.props.name}</h2>
				</div>
				<div className="row">
					<label>${this.props.rate}</label>
				</div>
				<div className="row">
					<button className="block blue one third skip-one align-center" onClick={this.onChoosePrice}> Choose Plan </button>
				</div>
			</div>
		);
	}
});

module.exports = Pricing;