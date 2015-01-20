'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	ErrorMessage = require('../../components/component-error-msg'),
	User = require('../../models/model-user'),
	UserStore = require('../../stores/store-user'),
	LenderStore = require('../../stores/store-borrower'),
	LenderActions = require('../../actions/action-lender');

var validateLenderInfo = function(lenderInfo) {
	var isValidInfo =
		lenderInfo.firstName && lenderInfo.firstName != "" &&
		lenderInfo.middleName && lenderInfo.middleName != "" &&
		lenderInfo.lastName && lenderInfo.lastName != "" &&
		lenderInfo.address && lenderInfo.address != "" &&
		lenderInfo.city && lenderInfo.city != "" &&
		lenderInfo.state && lenderInfo.state != "" &&
		lenderInfo.zip && lenderInfo.zip != "" &&
		lenderInfo.phone && lenderInfo.phone != "";
	return isValidInfo;
};

var LenderInfo = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation
	],

	statics: {
		willTransitionTo: function (transition){
			if(!UserStore.isAuthenticated()){
				transition.redirect('welcome');
			}
		}
	},

	getInitialState: function() {
		return {
			applicantInfoError: false,
			errorText: "",
			applicantType: "Lender"
		}
	},

	render: function() {
		return (
			<div>
				<h2>{this.state.applicantType}'s Name</h2>
				<div className="row">
					<input className="one third" type="text" ref="firstName" placeholder="First Name" required />
					<input className="one third" type="text" ref="middleName" placeholder="Middle Name" required />
					<input className="one third" type="text" ref="lastName" placeholder="Last Name" required />
				</div>
				<div className="row">
				</div>
				<div className="row">
					<input type="text" ref="address" placeholder="address" required />
				</div>
				<div className="row">
					<input className="one third" type="text" ref="city" placeholder="City" required />
					<input className="one third" type="text" ref="state" placeholder="State" required />
					<input className="one third" type="text" ref="zip" placeholder="Zip Code" required />
				</div>
				<h2>{this.state.applicantType}'s Contact Information</h2>
				<div className="row">
					<input className="one third" type="text" ref="phone" placeholder="Mobile Phone" required />
				</div>
				<ErrorMessage errorDisplay={this.state.applicantInfoError} errorMessage={this.state.errorText}/>
				<div className="row">
					<button className="one third blue button" onClick={this.onSubmitInfo}>Continue</button>
				</div>
			</div>
		)
	},
	onSubmitInfo: function(e){

		var applicantInfo = {
			firstName: this.refs.firstName.getDOMNode().value,
			middleName: this.refs.middleName.getDOMNode().value || "",
			lastName: this.refs.lastName.getDOMNode().value,
			address: this.refs.address.getDOMNode().value,
			city: this.refs.city.getDOMNode().value,
			state: this.refs.state.getDOMNode().value,
			zip: this.refs.zip.getDOMNode().value,
			phone: this.refs.phone.getDOMNode().value
		};

		if(validateLenderInfo(this.state.applicantType, applicantInfo)) {
			applicantInfo.type = "lender";
			User.update(UserStore.getCurrentUser()._id, applicantInfo).then(function () {
				LenderActions.submitBasicInfo(applicantInfo);
				this.transitionTo('dashboard');
			}.bind(this), function (error) {
				console.log(error.message);
				this.setState({
					applicantInfoError: true,
					errorText: error.message
				});
			}.bind(this));
		} else {
			this.setState({
				applicantInfoError: true,
				errorText: "All the fields are required."
			});
		}
	}
});

module.exports = LenderInfo;