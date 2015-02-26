'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	MessageBox = require('../../components/message-box'),
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
            transition.wait(
                User.isAuthenticated().then(function (req) {
                    if (!req.isAuthenticated) {
                        transition.redirect( 'welcome' );
                    }
                })
            );
		}
	},

	getInitialState: function() {
		return {
			applicantInfoError: false,
			errorText: "",
			applicantType: "Lender"
		}
	},

	onSubmitInfo: function(e){

        e.preventDefault();

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
			appId: [this.getQuery().appId] || null
		};

		if(validateLenderInfo(applicantInfo)) {
			applicantInfo.type = "lender";
			User.update(UserStore.getCurrentUserId(), applicantInfo).then(function () {
				LenderActions.submitBasicInfo(applicantInfo);
				this.transitionTo('dashboardApplications');
			}.bind(this), function (error) {
				this.setState({
					applicantInfoError: true,
					errorText: error.responseJSON.message
				});
			}.bind(this));
		} else {
			this.setState({
				applicantInfoError: true,
				errorText: "All the fields are required."
			});
		}
	},

    render: function() {

        var lenderInfo = LenderStore.getLender();

        var lenderName = (
            <form className="row">
                <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                    {(lenderInfo.basicInfo && lenderInfo.basicInfo.firstName) ? (
                        <input className="form-control"
                            type="text"
                            ref="firstName"
                            placeholder="First Name"
                            value={lenderInfo.basicInfo.firstName} />
                    ) : (
                        <input className="form-control" type="text" ref="firstName" placeholder="First Name" required />
                    )}
                </div>
                <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                    <input className="form-control" type="text" ref="middleName" placeholder="Middle Name" required />
                </div>
                <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                    {(lenderInfo.basicInfo && lenderInfo.basicInfo.lastName) ? (
                        <input className="form-control"
                            type="text"
                            ref="lastName"
                            placeholder="Last Name"
                            value={lenderInfo.basicInfo.lastName} />
                    ) : (
                        <input className="form-control" type="text" ref="lastName" placeholder="Last Name" required />
                    )}
                </div>
            </form>
        );

        var lenderAddress = (
            <form className="row">
                <div className="row gap-bottom">
                    <div className="col-md-9 col-xs-12">
                        <input className="form-control" type="text" ref="address" placeholder="address"  required />
                    </div>
                </div>
                <div className="row gap-bottom">
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="city" placeholder="City" required />
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <select ref="state" className="form-control">
                            {Constants.usStates.map(function(state) {
                                return <option key={state.data} value={state.data}>{state.label}</option>;
                            })}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="zip" placeholder="Zip Code" required />
                    </div>
                </div>
            </form>
        );

        var lenderContact = (
            <form className="row gap-bottom">
                <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                    {(lenderInfo.basicInfo && lenderInfo.basicInfo.organization) ? (
                        <input className="form-control"
                            type="text"
                            ref="organization"
                            placeholder="Organization"
                            value={lenderInfo.basicInfo.organization} />
                    ) : (
                        <input className="form-control" type="text" ref="organization" placeholder="Organization" required />
                    )}
                </div>
                <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                    <input className="form-control" type="text" ref="phone" placeholder="Mobile Phone" required />
                </div>
            </form>
        );

        return (
            <div className="container">
                <div className="row">
                    <h2 className="col-xs-12 bordered-bottom double-gap-bottom">{this.state.applicantType}'s Name</h2>
                    {lenderName}
                </div>
                <div className="row">
                    <h2 className="col-xs-12 bordered-bottom double-gap-bottom">{this.state.applicantType}'s Address</h2>
                        {lenderAddress}
                </div>
                <div className="row">
                    <h2 className="col-xs-12 bordered-bottom double-gap-bottom">{this.state.applicantType}'s Contact Information</h2>
                    {lenderContact}
                </div>
                <div className="row triple-gap-bottom">
                    <div className="col-xs-12">
                        <div className="row">
                            <MessageBox gridPos="col-sm-6 col-xs-12" displayMessage={this.state.applicantInfoError} message={this.state.errorText} type='error' />
                        </div>
                        <div className="row">
                            <button className="btn btn-md btn-dark-blue col-sm-6 col-xs-12" onClick={this.onSubmitInfo}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LenderInfo;