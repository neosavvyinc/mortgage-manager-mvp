var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var ErrorMessage = require('../../components/component-error-msg');
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
        applicantInfo.zipCode && applicantInfo.zipCode != "" &&
        applicantInfo.mobile && applicantInfo.mobile != "";
    if(applicantType == "Co-Applicant"){
        isValidInfo = isValidInfo && applicantInfo.email && applicantInfo.email != "";
    }
    return isValidInfo;
};

var resetApplicantInfo = function(){
    this.refs.firstName.getDOMNode().value = "";
    this.refs.middleName.getDOMNode().value = "";
    this.refs.lastName.getDOMNode().value = "";
    this.refs.address.getDOMNode().value = "";
    this.refs.city.getDOMNode().value = "";
    this.refs.state.getDOMNode().value = "";
    this.refs.zipCode.getDOMNode().value = "";
    this.refs.mobile.getDOMNode().value = "";
    this.refs.email.getDOMNode().value = "";
};

var ApplicantBasic = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    defaultProps: {
        applicantType: "Applicant"
    },

    getInitialState: function(){
        return {
            sameAddress: false,
            applicantInfoError: false,
            errorText: "",
            applicantType: "Applicant",
            shareAddress: false
        }
    },

    render: function(){

        var showCoapplicantFieldClass = this.state.applicantType == "Co-Applicant" ? "one third" : "hidden";

        return (
            <div>
                <h2>{this.state.applicantType}'s Name</h2>
                <div className="row">
                    <input className="one third" type="text" ref="firstName" placeholder="First Name" required />
                    <input className="one third" type="text" ref="middleName" placeholder="Middle Name" required />
                    <input className="one third" type="text" ref="lastName" placeholder="Last Name" required />
                </div>
                <h2>{this.state.applicantType}'s Address</h2>
                <div className="row">
                    <input type="text" ref="address" placeholder="address" required />
                </div>
                <div className="row">
                    <h2 className="one third">{this.state.applicantType}'s Contact Information</h2>
                    <input className={showCoapplicantFieldClass} type="checkbox" ref="sameAddress" onChange={this.populateAddress}/>
                </div>
                <div className="row">
                    <input className="one third" type="text" ref="city" placeholder="City" required />
                    <input className="one third" type="text" ref="state" placeholder="State" required />
                    <input className="one third" type="text" ref="zipCode" placeholder="Zip Code" required />
                </div>
                <h2>{this.state.applicantType}'s Contact Information</h2>
                <div className="row">
                    <input className="one third" type="text" ref="mobile" placeholder="Mobile Phone" required />
                    <input className={showCoapplicantFieldClass} type="email" ref="email" placeholder="Email" required />
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
            zipCode: this.refs.zipCode.getDOMNode().value,
            mobile: this.refs.mobile.getDOMNode().value,
            email: this.refs.email.getDOMNode().value || ""
        };

        if(validateApplicantInfo(this.state.applicantType, applicantInfo)) {
            if(this.state.applicantType == "Applicant") {
                delete applicantInfo.email;
                applicantInfo.type = "borrower";
                User.update(applicantInfo).then(function () {
                    if(BorrowerStore.getBorrower().hasCoapplicant){
                        BorrowerActions.submitBasicInfo(applicantInfo);
                        this.setState({
                            applicantType: "Co-Applicant"
                        });
                        resetApplicantInfo.bind(this)();
                    } else {
                        this.transitionTo('dashboard');
                    }
                }.bind(this), function (error) {
                    this.setState({
                        applicantInfoError: true,
                        errorText: error.message
                    });
                }.bind(this));
            } else {
                User.addCoapplicant(UserStore.getCurrentUser().userId, applicantInfo).then(function(){
                    BorrowerActions.resetBorrower();
                    this.transitionTo('dashboard');
                }.bind(this), function(error){
                    this.setState({
                        applicantInfoError: true,
                        errorText: error.message
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
        }, function(){
            if(this.state.shareAddress){
                this.refs.city.getDOMNode().value = BorrowerStore.getBorrower().basicInfo.city;
                this.refs.state.getDOMNode().value = BorrowerStore.getBorrower().basicInfo.state;
                this.refs.zipCode.getDOMNode().value = BorrowerStore.getBorrower().basicInfo.zipCode;
            } else {
                this.refs.city.getDOMNode().value = "";
                this.refs.state.getDOMNode().value = "";
                this.refs.zipCode.getDOMNode().value = "";
            }
        });
    }
});

module.exports = ApplicantBasic;
