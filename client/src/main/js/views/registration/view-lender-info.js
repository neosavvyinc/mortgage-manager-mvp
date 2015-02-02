'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	ErrorMessage = require('../../components/error-message'),
	User = require('../../models/model-user'),
	UserStore = require('../../stores/store-user'),
	LenderStore = require('../../stores/store-lender'),
	LenderActions = require('../../actions/action-lender'),
    Constants = require('../../constants/constants');

var validateLenderInfo = function(lenderInfo) {
	var isValidInfo =
		lenderInfo.firstName && lenderInfo.firstName != "" &&
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

		var lenderInfo = LenderStore.getLender();

		var lenderName = (
			<div className="row gap-bottom">
				{(lenderInfo.basicInfo && lenderInfo.basicInfo.firstName) ? (
					<input className="one fourth half-gap-right"
						type="text"
						ref="firstName"
						placeholder="First Name"
						value={lenderInfo.basicInfo.firstName} />
				) : (
					<input className="one fourth half-gap-right" type="text" ref="firstName" placeholder="First Name" required />
				)}
				<input className="one fourth half-gap-right" type="text" ref="middleName" placeholder="Middle Name" required />
				{(lenderInfo.basicInfo && lenderInfo.basicInfo.lastName) ? (
					<input className="one fourth"
						type="text"
						ref="lastName"
						placeholder="Last Name"
						value={lenderInfo.basicInfo.lastName} />
				) : (
					<input className="one fourth" type="text" ref="lastName" placeholder="Last Name" required />
				)}
			</div>
		);

		var lenderAddress = (
			<div>
				<div className="row gap-bottom">
					<input className="three fourths" type="text" ref="address" placeholder="address"  required />
				</div>
				<div className="row gap-bottom">
					<input className="one fourth half-gap-right" type="text" ref="city" placeholder="City" required />
					<select ref="state" className="one fourth half-gap-right">
                        {Constants.usStates.map(function(state) {
	                        return <option key={state.data} value={state.data}>{state.label}</option>;
                        })}
					</select>
					<input className="one fourth" type="text" ref="zip" placeholder="Zip Code" required />
				</div>
			</div>
		);

		var lenderContact = (
			<div className="row gap-bottom">
				{(lenderInfo.basicInfo && lenderInfo.basicInfo.organization) ? (
					<input className="one third half-gap-right"
						type="text"
						ref="organization"
						placeholder="Organization"
						value={lenderInfo.basicInfo.organization} />
				) : (
					<input className="one third half-gap-right" type="text" ref="organization" placeholder="Organization" required />
				)}
				<input className="one third half-gap-right" type="text" ref="phone" placeholder="Mobile Phone" required />
			</div>
		);

		return (
			<div className="container">
				<div className="gap-top">
					<h2>{this.state.applicantType}'s Name</h2>
				{lenderName}
					<div className="row">
						<h2 className="one third">{this.state.applicantType}'s Address</h2>
					</div>
                {lenderAddress}
					<h2>{this.state.applicantType}'s Contact Information</h2>
				{lenderContact}
					<ErrorMessage errorDisplay={this.state.applicantInfoError} errorMessage={this.state.errorText}/>
					<div className="row">
						<button className="one third turquoise button" onClick={this.onSubmitInfo}>Continue</button>
					</div>
				</div>
			</div>
		);
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
			phone: this.refs.phone.getDOMNode().value,
			organization: this.refs.organization.getDOMNode().value,
			appId: LenderStore.getLender().appId || null
		};

		if(validateLenderInfo(applicantInfo)) {
			applicantInfo.type = "lender";
			User.update(UserStore.getCurrentUserId(), applicantInfo).then(function () {
				LenderActions.submitBasicInfo(applicantInfo);
				this.transitionTo('dashboardApplications');
			}.bind(this), function (error) {
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