'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Constants = require('../../../constants/constants'),
	MessageBox = require('../../../components/message-box'),
	ModelPayment = require('../../../models/model-payment'),
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
			submitButtonClass: 'one third turquoise button',
			spinnerClass: 'hidden'
		};
	},

	onMakePayment: function(ev) {
		ev.preventDefault();

		this.setState({
			submitButtonClass: 'one third button disabled',
			spinnerClass: '',
			showMessage: false
		});

		if(Stripe.card.validateCardNumber(this.refs.cardNumber.getDOMNode().value)) {
			ModelPayment.createToken(this.refs.paymentForm.getDOMNode(), function (status, response) {
				if (response.error) {
					this.setState({
						submitButtonClass: 'one third button turquoise',
						spinnerClass: 'hidden',
						showMessage: true,
						messageText: response.error.message
					});
				} else {
					ModelPayment.makePayment(response.id, response.card, this.state.idempotentToken, this.getParams().price.replace('$', '')).then(
						function() {
							this.setState({
								showMessage: false,
								spinnerClass: 'hidden'
							});
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
				submitButtonClass: 'one third button turquoise',
				spinnerClass: 'hidden',
				showMessage: true,
				messageText: 'Invalid Credit card number'
			});
		}
	},

	render: function() {
		return (
			<form ref="paymentForm" className="container gap-top">
				<h1>Make Payment</h1>
				<div className="gap-top divBorder">
					<h2>Name</h2>
					<div className="row gap-bottom">
						<input className="two fourths half-gap-right" type="text" ref="firstName" placeholder="Name on card" data-stripe="name" required />
					</div>
					<div className="row">
						<h2 className="one third">Billing Address</h2>
					</div>
					<div>
						<div className="row gap-bottom">
							<input className="three fourths" type="text" ref="address" placeholder="Address" data-stripe="address-line1" required />
						</div>
						<div className="row gap-bottom">
							<input className="one fourth half-gap-right" type="text" ref="city" placeholder="City" data-stripe="address-city" required />
							<select ref="state" className="one fourth half-gap-right" data-stripe="address-state">
		                        {Constants.usStates.map(function(state) {
			                        return <option key={state.data} value={state.data}>{state.label}</option>;
		                        })}
							</select>
							<input className="one fourth" type="text" ref="zip" placeholder="Zip Code" data-stripe="address-zip" required />
						</div>
					</div>
					<h2>Contact</h2>
					<div className="row gap-bottom">
						<input className="one third half-gap-right" type="text" ref="phone" placeholder="Mobile Phone" required />
						<input className="one third" type="email" ref="email" placeholder="Email" required />
					</div>
					<div className="row">
						<label className="two thirds">
							<h2>Card Number</h2>
							<input ref="cardNumber" className="three sixths" type="text" maxLength="20" data-stripe="number"/>
							<div className="three sixths">
								<span ref="cvc" className="gap-left one sixth">CVC</span>
								<input className="one sixth" type="password" maxLength="4" data-stripe="cvc"/>
							</div>
						</label>
					</div>
					<div className="row">
						<h2>Expiration (MM/YYYY)</h2>
						<div className="three sixths">
							<input ref="expMonth" className="one ninth gap-right" type="text" maxLength="2" data-stripe="exp-month"/>
							<input ref="expYear" className="two ninths" type="text" maxLength="4" data-stripe="exp-year"/>
						</div>
					</div>
					<div className="row gap-top">
						<div className="three sixths">
							<h2 className="gap-left two sixths">Amount: {this.getParams().price}</h2>
						</div>
					</div>
					<div className="row gap-top">
						<button className={this.state.submitButtonClass} onClick={this.onMakePayment}>Make Payment</button>
						<h1 className={this.state.spinnerClass}>&nbsp;<i className="fa fa-spinner fa-pulse"></i></h1>
					</div>
					<div className="row gap-top">
						<div className="one third">
							<MessageBox displayMessage={this.state.showMessage} message={this.state.messageText} type={this.state.messageType} />
						</div>
					</div>
				</div>
			</form>
		);
	}
});

module.exports = StripePayment;