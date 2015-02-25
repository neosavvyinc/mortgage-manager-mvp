'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux');

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
            <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Your Trial Period has expired</h3>
                            </div>

                            <div className="modal-body">

                                <div className="row">
                                Please help us to continue to support you and make your mortgage process a lot less painstaking.
                                If you choose to continue on the trial version, you will not be able to use premium features.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.close}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.onUpgrade}>Upgrade</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = TrialExpired;
