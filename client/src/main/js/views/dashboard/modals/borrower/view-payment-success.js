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
            <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Your Payment was successful!</h3>
                            </div>
                            <div className="modal-body text-center">
                                <i className="fa fa-check-circle-o icon-xxl dark-green"></i>
                                <p className="gap-top">Thank you for your support. You can now access all the premium features</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark-blue" onClick={this.close}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = PaymentSuccess;