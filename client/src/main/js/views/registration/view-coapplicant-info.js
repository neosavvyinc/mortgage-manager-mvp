var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var Constants = require('../../constants/constants');
var MessageBox = require('../../components/message-box');
var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');

var validateApplicantInfo = function(applicantType, applicantInfo){
    var isValidInfo =
        applicantInfo.firstName && applicantInfo.firstName != "" &&
        applicantInfo.lastName && applicantInfo.lastName != "" &&
        applicantInfo.address && applicantInfo.address != "" &&
        applicantInfo.city && applicantInfo.city != "" &&
        applicantInfo.state && applicantInfo.state != "" &&
        applicantInfo.zip && applicantInfo.zip != "" &&
        applicantInfo.phone && applicantInfo.phone != "" &&
        applicantInfo.email && applicantInfo.email != "";
    return isValidInfo;
};

var CoApplicantInfo = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],
    
    statics: {
        willTransitionTo: function (transition){
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (!res.isAuthenticated) {
                        transition.redirect('welcome');
                    }
                })
            );
        }
    },

    getInitialState: function(){
        return {
            sameAddress: false,
            applicantInfoError: false,
            errorText: "",
            shareAddress: false,
            currentUserId: UserStore.getCurrentUserId(),
            applicantData: {}
        }
    },

    componentDidMount: function(){
        User.getUserDetails(UserStore.getCurrentUserId()).then(function(res){
            this.setState({
                applicantData: res
            });
        }.bind(this));
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
            applicantInfo.phone = applicantInfo.phone.replace(/\D/g, '');
            applicantInfo.type = "borrower";
            applicantInfo.appId = this.state.applicantData.appId;
            User.emailExists(this.refs.email.getDOMNode().value).then(
                function(){
                    User.addCoapplicant(this.state.currentUserId, applicantInfo).then(function(){
                        this.transitionTo('dashboardApplications');
                    }.bind(this), function(error){
                        this.setState({
                            applicantInfoError: true,
                            errorText: error.responseJSON.message
                        });
                    }.bind(this));
                }.bind(this),
                function(error){
                    this.setState({
                        applicantInfoError: true,
                        errorText: error.responseJSON.message
                    });
                }.bind(this)
            );

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
        var applicantAddress = this.state.shareAddress ?  (
            <div>
                <div className="row gap-bottom">
                    <div className="col-md-9 col-xs-12">
                        <input className="form-control" type="text" ref="address" placeholder="address" value={this.state.applicantData.address} required />
                    </div>
                </div>
                <div className="row gap-bottom">
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="city" placeholder="City" value={this.state.applicantData.city} required />
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <select ref="state" className="form-control" value={this.state.applicantData.state}>
                            <option value={this.state.applicantData.state}>{this.state.applicantData.state}</option>
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                        <input className="form-control" type="text" ref="zip" placeholder="Zip Code" value={this.state.applicantData.zip} required />
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
                    <h2 className="col-xs-12 bordered-bottom double-gap-bottom">Coapplicant's Name</h2>
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
                        <div className="col-xs-8">
                            <h2 className="bordered-bottom double-gap-bottom">Coapplicant's Address</h2>
                        </div>
                        <div className="col-xs-4">
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
                    <h2 className="col-xs-12 bordered-bottom">Coapplicant's Contact Information</h2>
                    <form className="row">
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="phone" placeholder="Mobile Phone" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="email" ref="email" placeholder="Email" required />
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

module.exports = CoApplicantInfo;
