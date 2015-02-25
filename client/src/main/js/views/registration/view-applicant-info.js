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
            if(!BorrowerStore.getBorrower()) {
                transition.redirect('welcome');
            }
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (!res.isAuthenticated) {
                        transition.redirect('welcome');
                    }
                })
            );
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
            email: this.refs.email.getDOMNode().value || ""
        };

        if(validateApplicantInfo(this.state.applicantType, applicantInfo)) {
            if(this.state.applicantType == "Applicant") {
                applicantInfo.phone = applicantInfo.phone.replace(/\D/g, '');
                delete applicantInfo.email;
                applicantInfo.isSelfEmployed = this.state.currentBorrower.isSelfEmployed;
                applicantInfo.recentlyMarried = this.state.currentBorrower.recentlyMarried;
                applicantInfo.renting = this.state.currentBorrower.renting;
                applicantInfo.hasFinancialAssets = this.state.currentBorrower.hasFinancialAssets;

                User.update(this.state.currentUserId, applicantInfo).then(function () {
                    if(this.state.currentBorrower.hasCoapplicant){
                        BorrowerActions.submitBasicInfo(applicantInfo);
                        this.setState({
                            applicantType: "Co-Applicant",
                            applicantInfoError: false,
                            errorText: ""
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

        var showCoapplicantFieldClass = this.state.applicantType == "Co-Applicant" ? "col-xs-4" : "hidden";
        var showEmailClass = this.state.applicantType == "Co-Applicant" ? "form-control" : "hidden";

        var borrowerBasicInfo = this.state.currentBorrower.basicInfo;

        var applicantAddress = this.state.shareAddress ?  (
            <div>
                <div className="row gap-bottom">
                    <div className="col-md-9 col-xs-12">
                        <input className="form-control" type="text" ref="address" placeholder="address" value={borrowerBasicInfo.address} required />
                    </div>
                </div>
                <div className="row gap-bottom">
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="city" placeholder="City" value={borrowerBasicInfo.city} required />
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <select ref="state" className="form-control" value={borrowerBasicInfo.state}>
                            <option value={borrowerBasicInfo.state}>{borrowerBasicInfo.state}</option>
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="zip" placeholder="Zip Code" value={borrowerBasicInfo.zip} required />
                    </div>
                </div>
            </div>
        ) : (
            <div>
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
            </div>
        );

        return (
            <div className="container">
                <div className="row">
                    <h2 className="col-xs-12 bordered-bottom double-gap-bottom">{this.state.applicantType}'s Name</h2>
                    <form className="row">
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="firstName" placeholder="First Name" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="middleName" placeholder="Middle Name" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="lastName" placeholder="Last Name" required />
                        </div>
                    </form>
                    <div className="row">
                        <h2 className="col-xs-8 bordered-bottom double-gap-bottom">{this.state.applicantType}'s Address</h2>
                        <div className={showCoapplicantFieldClass}>
                            <div className="row">
                                <p className="col-xs-8">Shares address with main applicant:</p>
                                <div className="col-xs-4">
                                    <input className="form-control" type="checkbox" ref="sameAddress" onChange={this.populateAddress}/>
                                </div>
                            </div>
                        </div>
                {applicantAddress}
                    </div>
                </div>
                <div className="row double-gap-bottom">
                    <h2 className="col-xs-12 bordered-bottom">{this.state.applicantType}'s Contact Information</h2>
                    <form class="row">
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="phone" placeholder="Mobile Phone" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className={showEmailClass} type="email" ref="email" placeholder="Email" required />
                        </div>
                    </form>
                </div>
                <div className="row">
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
        )
    }

});

module.exports = ApplicantInfo;
