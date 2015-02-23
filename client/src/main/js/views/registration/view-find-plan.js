'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	_ = require('lodash'),
	Table = require('../../components/table');


var PricingOptions = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

    back: function() {
        this.transitionTo('welcome');
    },

	render: function() {
		var yesIcon = <div><i className="fa fa-check text-success"></i> </div>,
			tableFeatures = {
                'Price After 15 Days': ['$100'],
				'Upload Documents': [yesIcon],
				'View Documents': [yesIcon],
				'Invite Lenders': [yesIcon]
			},
			tableHeader = ((
				<thead>
					<th className="text-center label-lg">Features</th>
					<th className="text-center label-lg">Premium</th>
				</thead>
			)),
			colSpacingArr = [
				<col style={{width: '35%'}}/>,
				<col style={{width: '65%'}}/>
			];

		return (
            <div className="bg-color fill">
                <div className="container container-color fill">
                    <div className="row">
                        <h1 className="bordered-bottom gap-bottom"><i className="fa fa-chevron-left pointer" onClick={this.back}></i>  Pricing</h1>
                        <div className="row triple-gap-top">
                            <div className="col-md-8 col-md-offset-2 col-xs-12">
                                <Table name="Pricing" colSpacing={colSpacingArr} textPosition="center" header={tableHeader} table={tableFeatures}/>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
});

module.exports = PricingOptions;