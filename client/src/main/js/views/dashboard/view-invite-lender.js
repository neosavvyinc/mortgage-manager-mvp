'use strict';

var React = require('react'),
    Router = require('react-router'),
    Reflux = require('reflux'),
    ErrorMessage = require('../../components/error-message'),
    Application = require('../../models/model-application'),
    UserStore = require('../../stores/store-user');

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

    close: function() {
        this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
    },

    onInviteLender: function(){
        var lenderInfo = {
            firstName: this.refs.firstName.getDOMNode().value,
            lastName: this.refs.lastName.getDOMNode().value,
            email: this.refs.email.getDOMNode().value,
            organization: this.refs.organization.getDOMNode().value
        };

        if(validateLenderInfo(lenderInfo)) {
            var appId = this.getParams().appId;

            Application.lenderInvite(appId, UserStore.getCurrentUserId(), lenderInfo).then(function(){
                this.close();
            }.bind(this), function(error){
                this.setState({
                    inviteError: true,
                    inviteErrorText: error.responseJSON.message
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
            <form className="uploadComponent">
                <legend><h1 className="gap-top">Invite your Lenders</h1></legend>
                <div onClick={this.close} title="Close" className="close">X</div>
                <div className="row">
                    <div className="one half padded">
                        <input type="text" ref="firstName" placeholder="First Name"/>
                    </div>
                    <div className="padded one half">
                        <input type="text" ref="lastName" placeholder="Last Name"/>
                    </div>
                </div>
                <div className="row padded">
                    <input type="email" ref="email" placeholder="Email Address"/>
                </div>
                <div className="row padded one half">
                    <input type="text" ref="organization" placeholder="Organizations"/>
                </div>
                <div className="row padded">
                    <div className="one fourth skip-two padded submit">
                        <button className="red block gap-right gap-bottom" onClick={this.close}>Close</button>
                    </div>
                    <div className="one fourth padded submit">
                        <button className="green block gap-right gap-bottom" onClick={this.onInviteLender}>Send</button>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = UploadDocument;