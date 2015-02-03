var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var Constants = require('../../constants/constants');
var MessageBox = require('../../components/message-box');
var User = require('../../models/model-user');
var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');
var UserStore = require('../../stores/store-user');

var validateApplicantInfo = function(applicantType, applicantInfo){
    var isValidInfo =
        applicantInfo.firstName && applicantInfo.firstName != "" &&
        applicantInfo.lastName && applicantInfo.lastName != "" &&
        applicantInfo.address && applicantInfo.address != "" &&
        applicantInfo.city && applicantInfo.city != "" &&
        applicantInfo.state && applicantInfo.state != "" &&
        applicantInfo.zip && applicantInfo.zip != "" &&
        applicantInfo.phone && applicantInfo.phone != "";
    if(applicantType == "Co-Applicant"){
        isValidInfo = isValidInfo && applicantInfo.email && applicantInfo.email != "";
    }
    return isValidInfo;
};

var resetApplicantInfo = function(self){
    self.refs.firstName.getDOMNode().value = "";
    self.refs.middleName.getDOMNode().value = "";
    self.refs.lastName.getDOMNode().value = "";
    self.refs.address.getDOMNode().value = "";
    self.refs.city.getDOMNode().value = "";
    self.refs.state.getDOMNode().value = "";
    self.refs.zip.getDOMNode().value = "";
    self.refs.phone.getDOMNode().value = "";
    self.refs.email.getDOMNode().value = "";
};

var ApplicantInfo = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],
    
    statics: {
        willTransitionTo: function (transition){
            if(!UserStore.isAuthenticated() || !BorrowerStore.getBorrower()){
                transition.redirect('welcome');
            }
        }
    },

    defaultProps: {
        applicantType: "Applicant"
    },

    getInitialState: function(){
        return {
            sameAddress: false,
            applicantInfoError: false,
            errorText: "",
            applicantType: "Applicant",
            shareAddress: false,
            currentUserId: UserStore.getCurrentUserId(),
            currentBorrower: BorrowerStore.getBorrower()
        }
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
            email: this.refs.email.getDOMNode().value || ""
        };

        if(validateApplicantInfo(this.state.applicantType, applicantInfo)) {
            if(this.state.applicantType == "Applicant") {
                delete applicantInfo.email;
                applicantInfo.isSelfEmployed = this.state.currentBorrower.isSelfEmployed;
                applicantInfo.recentlyMarried = this.state.currentBorrower.recentlyMarried;
                applicantInfo.renting = this.state.currentBorrower.renting;
                applicantInfo.hasFinancialAssets = this.state.currentBorrower.hasFinancialAssets;

                User.update(this.state.currentUserId, applicantInfo).then(function () {
                    if(this.state.currentBorrower.hasCoapplicant){
                        BorrowerActions.submitBasicInfo(applicantInfo);
                        this.setState({
                            applicantType: "Co-Applicant"
                        });
                        resetApplicantInfo(this);
                    } else {
                        User.generateApplication(this.state.currentUserId).then(function(){
                            this.transitionTo('dashboardApplications');
                        }.bind(this), function(error){
                            this.setState({
                                applicantInfoError: true,
                                errorText: error.responseJSON.message
                            });
                        }.bind(this));
                    }
                }.bind(this), function (error) {
                    this.setState({
                        applicantInfoError: true,
                        errorText: error.responseJSON.message
                    });
                }.bind(this));

            } else {
                applicantInfo.type = "borrower";

                User.addCoapplicant(this.state.currentUserId, applicantInfo).then(function(){
                    BorrowerActions.resetBorrower();
                    User.generateApplication(this.state.currentUserId).then(function(){
                        this.transitionTo('dashboardApplications');
                    }.bind(this), function(error){
                        this.setState({
                            applicantInfoError: true,
                            errorText: error.responseJSON.message
                        });
                    }.bind(this));
                }.bind(this), function(error){
                    this.setState({
                        applicantInfoError: true,
                        errorText: error.responseJSON.message
                    });
                }.bind(this));

            }
        } else {
            this.setState({
                applicantInfoError: true,
                errorText: "All the fields are required."
            });
        }
    },

    populateAddress: function(){
        this.setState({
            shareAddress: !this.state.shareAddress
        });
    },

    render: function(){

        var showCoapplicantFieldClass = this.state.applicantType == "Co-Applicant" ? "two thirds" : "hidden";
        var showEmailClass = this.state.applicantType == "Co-Applicant" ? "one third" : "hidden";

        var borrowerBasicInfo = this.state.currentBorrower.basicInfo;

        var applicantAddress = this.state.shareAddress ?  (
            <div>
                <div className="row gap-bottom">
                    <input className="three fourths" type="text" ref="address" placeholder="address" value={borrowerBasicInfo.address} required />
                </div>
                <div className="row gap-bottom">
                    <input className="one fourth half-gap-right" type="text" ref="city" placeholder="City" value={borrowerBasicInfo.city} required />
                    <select ref="state" className="one fourth half-gap-right" value={borrowerBasicInfo.state}>
                        <option value={borrowerBasicInfo.state}>{borrowerBasicInfo.state}</option>
                    </select>
                    <input className="one fourth" type="text" ref="zip" placeholder="Zip Code" value={borrowerBasicInfo.zip} required />
                </div>
            </div>
        ) : (
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

        return (
            <div className="container">
                <div className="gap-top">
                    <h2>{this.state.applicantType}'s Name</h2>
                    <div className="row gap-bottom">
                        <input className="one fourth half-gap-right" type="text" ref="firstName" placeholder="First Name" required />
                        <input className="one fourth half-gap-right" type="text" ref="middleName" placeholder="Middle Name" required />
                        <input className="one fourth" type="text" ref="lastName" placeholder="Last Name" required />
                    </div>
                    <div className="row">
                        <h2 className="one third">{this.state.applicantType}'s Address</h2>
                        <div className={showCoapplicantFieldClass}>
                            <p className="one third">Shares address with main applicant:</p>
                            <input type="checkbox" ref="sameAddress" onChange={this.populateAddress}/>
                        </div>
                    </div>
                {applicantAddress}
                    <h2>{this.state.applicantType}'s Contact Information</h2>
                    <div className="row gap-bottom">
                        <input className="one third half-gap-right" type="text" ref="phone" placeholder="Mobile Phone" required />
                        <input className={showEmailClass} type="email" ref="email" placeholder="Email" required />
                    </div>
                    <MessageBox displayMessage={this.state.applicantInfoError} message={this.state.errorText} type='error' />
                    <div className="row">
                        <button className="one third turquoise button" onClick={this.onSubmitInfo}>Continue</button>
                    </div>
                </div>
            </div>
        )
    }

});

module.exports = ApplicantInfo;
