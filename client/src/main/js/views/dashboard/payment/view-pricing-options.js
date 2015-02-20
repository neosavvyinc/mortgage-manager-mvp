'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	_ = require('lodash'),
	Table = require('../../../components/table');


var PricingOptions = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	onChoosePremium: function() {
		this.transitionTo('stripePayment', {price: '$100'});
	},

	onChooseTrial: function() {
		this.transitionTo('dashboardApplications');
	},

	render: function() {
		var yesIcon = <div><i className="fa fa-check green"></i> </div>,
			noIcon = <div><span><i className="fa fa-times red"></i> </span> &nbsp;&nbsp;&nbsp;After 15 days</div>,
			tableFeatures = {
				'Cost': ['Free', '$100'],
				'Upload Documents': [noIcon, yesIcon],
				'View Documents': [noIcon, yesIcon],
				'Invite Lenders': [noIcon, yesIcon],
				'': [<button className="blue align-right gap-top" onClick={this.onChooseTrial}> Choose Plan</button>,
						<button className="blue align-right gap-top" onClick={this.onChoosePremium}> Choose Plan </button>
					]
			},
			tableHeader = ((
				<thead>
					<th className="align-center">Features</th>
					<th className="align-center">15 day Trial</th>
					<th className="align-center">Premium</th>
				</thead>
			)),
			colSpacingArr = [
				<col style={{width: '20%'}}/>,
				<col style={{width: '50%'}}/>,
				<col style={{width: '30%'}}/>
			];

		return (
			<div className="container gap-top">
				<div className="row">
					<div className="static">
						<h1>Pricing</h1>
						<div className="large">
							<Table name="Pricing" colSpacing={colSpacingArr} header={tableHeader} table={tableFeatures}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = PricingOptions;