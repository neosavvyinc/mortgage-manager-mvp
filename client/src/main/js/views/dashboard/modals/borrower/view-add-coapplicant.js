'use strict';

var React = require('react'),
    Router = require('react-router'),
    Reflux = require('reflux'),
    Constants = require('../../../../constants/constants'),
    MessageBox = require('../../../../components/message-box'),
    Application = require('../../../../models/model-application'),
    User = require('../../../../models/model-user'),
    UserStore = require('../../../../stores/store-user'),
    ApplicationStore = require('../../../../stores/store-application'),
    ApplicationActions = require('../../../../actions/action-application');

var validateApplicantInfo = function(applicantInfo){
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

var AddCoapplicant = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(ApplicationStore, "onNewCoapplicant")
    ],

    getInitialState: function() {
        return {
            error: false,
            errorText: ''
        };
    },

    close: function(e) {
        if(e){
            e.preventDefault();
        }
        this.transitionTo('viewProfile');
    },

    onNewCoapplicant: function(){
        debugger;
        this.transitionTo('viewProfile');
    },


    onAddCoapplicant: function(e){
        e.preventDefault();

        var coapplicantInfo = {
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

        if(validateApplicantInfo(coapplicantInfo)) {
            coapplicantInfo.phone = coapplicantInfo.phone.replace(/\D/g, '');
            coapplicantInfo.type = "borrower";
            User.emailExists(this.refs.email.getDOMNode().value).then(
                function(){
                    User.getUserDetails(UserStore.getCurrentUserId()).then(function(userDetails) {
                        coapplicantInfo.appId = userDetails.appId;
                        User.addCoapplicant(UserStore.getCurrentUserId(), coapplicantInfo).then(function(){
                            ApplicationActions.addCoapplicant();
                        }.bind(this), function(error){
                            this.setState({
                                applicantInfoError: true,
                                errorText: error.statusText
                            });
                        }.bind(this));

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
                inviteError: true,
                inviteErrorText: 'All fields are required'
            });
        }
    },

    render: function() {
        return (
            <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Add a CoApplicant</h3>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>First Name</label>
                                        <input className="form-control" type="text" ref="firstName" placeholder="First Name"/>
                                    </div>
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>Middle Name</label>
                                        <input className="form-control" type="text" ref="middleName" placeholder="Middle Name" required />
                                    </div>
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>Last Name</label>
                                        <input className="form-control" type="text" ref="lastName" placeholder="Last Name"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 gap-bottom">
                                        <label>Address</label>
                                        <input className="form-control" type="text" ref="address" placeholder="address"  required />
                                    </div>
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>City</label>
                                        <input className="form-control" type="text" ref="city" placeholder="City" required />
                                    </div>
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>State</label>
                                        <select ref="state" className="form-control">
                                            {Constants.usStates.map(function(state) {
                                                return <option key={state.data} value={state.data}>{state.label}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-sm-4 col-xs-12 gap-bottom">
                                        <label>Zip Code</label>
                                        <input className="form-control" type="text" ref="zip" placeholder="Zip Code" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>Email Address</label>
                                        <input className="form-control" type="email" ref="email" placeholder="Email Address"/>
                                    </div>
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>Phone Number</label>
                                        <input className="form-control" type="text" ref="phone" placeholder="Mobile Phone" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <MessageBox displayMessage={this.state.error} message={this.state.errorText} type='error' />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.close}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.onAddCoapplicant}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AddCoapplicant;