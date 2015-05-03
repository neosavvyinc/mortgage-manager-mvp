'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Constants = require('../../../constants/constants'),
	MessageBox = require('../../../components/message-box'),
	ModelPayment = require('../../../models/model-payment'),
	PaymentActions =  require('../../../actions/action-payment'),
	uuid = require('node-uuid');

var StripePayment = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function(){
		return {
			idempotentToken: uuid.v1(),
			messageText: '',
			showMessage: false,
			messageType: 'error',
			submitButtonClass: 'col-sm-6 col-xs-12 btn btn-md btn-dark-blue',
			spinnerClass: 'hidden',
			disablePayment: false,
            reuseAddress: false
		};
	},

	componentDidMount: function() {
		ModelPayment.getPublishableKey().then(
			function(key) {
				Stripe.setPublishableKey(key);
			},
			function(error) {
				this.setState({
					showMessage: true,
					spinnerClass: 'hidden',
					messageType: 'error',
					messageText: error.message
				});
			}
		);
	},

	onMakePayment: function(ev) {
		ev.preventDefault();
		var price;

		if(this.getParams().price === 'beta') {
			price = '1';
		} else {
			price = '100';
		}

		this.setState({
			submitButtonClass: 'col-sm-6 col-xs-12 btn btn-md btn-dark-blue disabled',
			spinnerClass: 'larger',
			showMessage: false,
			disablePayment: true
		});

		if(Stripe.card.validateCardNumber(this.refs.cardNumber.getDOMNode().value)) {
			ModelPayment.createToken(this.refs.paymentForm.getDOMNode(), function (status, response) {
				if (response.error) {
					this.setState({
						submitButtonClass: 'col-sm-6 col-xs-12 btn btn-md btn-dark-blue',
						spinnerClass: 'hidden',
						showMessage: true,
						messageText: response.error.message,
						disablePayment: false
					});
				} else {
					ModelPayment.makePayment(response.id, response.card, this.state.idempotentToken, price).then(
						function() {
							this.setState({
								showMessage: false,
								spinnerClass: 'hidden'
							});
							PaymentActions.upgrade();
							this.transitionTo('paymentSuccess');
						}.bind(this),
						function(error) {
							this.setState({
								showMessage: true,
								spinnerClass: 'hidden',
								messageType: 'error',
								messageText: error.message
							});
						}.bind(this));
				}
			}.bind(this));
		} else {
			this.setState({
				submitButtonClass: 'col-sm-6 col-xs-12 btn btn-md btn-dark-blue',
				spinnerClass: 'hidden',
				showMessage: true,
				messageText: 'Invalid Credit card number',
				disablePayment: false
			});
		}
	},

	render: function() {

        // TODO: Reuse user's personal address as billing address
		var price;

		if(this.getParams().price === 'beta') {
			price = '$1';
		} else {
			price = '$100';
		}

		return (
			<form ref="paymentForm" className="container">
                <div className="row">
                    <h1 className="col-xs-12 bordered-bottom">Make Payment</h1>
                </div>
                <div className="row">
                    <h3 className="col-xs-12 dotted-bottom double-gap-bottom">Card Information</h3>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <input className="gap-bottom form-control" type="text" ref="firstName" placeholder="Name on card" data-stripe="name" required />
                            </div>
                            <div className="col-xs-12">
                                <input ref="cardNumber" className="gap-bottom form-control" type="password" maxLength="20"  placeholder="Card Number" data-stripe="number"/>
                            </div>
                            <div className="col-xs-3">
                                <input ref="expMonth" className="gap-bottom form-control" type="text" maxLength="2"  placeholder="MM" data-stripe="exp-month"/>
                            </div>
                            <div className="col-xs-3">
                                <input ref="expYear" className="gap-bottom form-control" type="text" maxLength="4" placeholder="YYYY"  data-stripe="exp-year"/>
                            </div>
                            <div className="col-xs-6">
                                <input className="gap-bottom form-control" type="password" maxLength="4"  placeholder="CVC" data-stripe="cvc"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h3 className="col-xs-12 dotted-bottom double-gap-bottom">Billing Address</h3>
                    <div className="col-md-6 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <input className="gap-bottom form-control" type="text" ref="address" placeholder="Address" data-stripe="address-line1" required />
                            </div>
                            <div className="col-xs-4">
                                <input className="gap-bottom form-control" type="text" ref="city" placeholder="City" data-stripe="address-city" required />
                            </div>
                            <div className="col-xs-4">
                                <select ref="state" className="gap-bottom form-control" data-stripe="address-state">
                                {Constants.usStates.map(function(state) {
                                    return <option key={state.data} value={state.data}>{state.label}</option>;
                                })}
                                </select>
                            </div>
                            <div className="col-xs-4">
                                <input className="gap-bottom form-control" type="text" ref="zip" placeholder="Zip Code" data-stripe="address-zip" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h3 className="col-xs-12 double-gap-bottom">Amount: {price}</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <MessageBox displayMessage={this.state.showMessage} message={this.state.messageText} type={this.state.messageType} />
                                <div className="row">
		                            <button className={this.state.submitButtonClass} disabled={this.state.disablePayment} onClick={this.onMakePayment}>Make Payment</button>
		                            <h4 className={this.state.spinnerClass}>&nbsp;<i className="fa fa-spinner fa-pulse"></i></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</form>
		);
	}
});

module.exports = StripePayment;