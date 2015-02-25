'use strict';

var React = require('react'),
    Router = require('react-router'),
    Reflux = require('reflux'),
    MessageBox = require('../../../../components/message-box'),
    Application = require('../../../../models/model-application'),
    UserStore = require('../../../../stores/store-user'),
    LenderAction = require('../../../../actions/action-lender');

var validateLenderInfo = function(lenderInfo){
    return (lenderInfo.firstName && lenderInfo.firstName !== '' &&
    lenderInfo.lastName && lenderInfo.lastName !== '' &&
    lenderInfo.email && lenderInfo.email !== '' &&
    lenderInfo.organization && lenderInfo.organization !== '' );
};

var UploadDocument = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    getInitialState: function() {
        return {
            inviteError: false,
            inviteErrorText: ''
        };
    },

    close: function(e) {
        if(e){
            e.preventDefault();
        }
        this.transitionTo('dashboardAppDetails', {appId: this.getParams().appId, tabName:'lenders'});
    },

    onInviteLender: function(e){
        e.preventDefault();

        var lenderInfo = {
            firstName: this.refs.firstName.getDOMNode().value,
            lastName: this.refs.lastName.getDOMNode().value,
            email: this.refs.email.getDOMNode().value,
            organization: this.refs.organization.getDOMNode().value
        };

        if(validateLenderInfo(lenderInfo)) {
            var appId = this.getParams().appId;
            Application.lenderInvite(appId, lenderInfo).then(function(){
                LenderAction.inviteLender(lenderInfo);
                this.close();
            }.bind(this), function(error){
                this.setState({
                    inviteError: true,
                    inviteErrorText: error.responseText
                });
            }.bind(this));

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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Invite your Lenders</h3>
                            </div>
                            <div className="modal-body">
                                <div className="row double-gap-top">
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>First Name</label>
                                        <input className="form-control" type="text" ref="firstName" placeholder="First Name"/>
                                    </div>
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>Last Name</label>
                                        <input className="form-control" type="text" ref="lastName" placeholder="Last Name"/>
                                    </div>
                                </div>
                                <div className="row double-gap-top">
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>Email Address</label>
                                        <input className="form-control" type="email" ref="email" placeholder="Email Address"/>
                                    </div>
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <label>Organization</label>
                                        <input className="form-control" type="text" ref="organization" placeholder="Organizations"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <MessageBox displayMessage={this.state.inviteError} message={this.state.inviteErrorText} type='error' />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.close}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.onInviteLender}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UploadDocument;