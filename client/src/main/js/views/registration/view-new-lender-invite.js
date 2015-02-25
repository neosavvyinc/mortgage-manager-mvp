var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../../models/model-user');
var Navigation = require('../../components/navigation');
var LenderStore = require('../../stores/store-lender');
var UserStore = require('../../stores/store-user');
var Login = require('../../components/login');
var User = require('../../models/model-user');

var newLenderInvite = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(LenderStore, "onNewLender"),
        Reflux.listenTo(UserStore, "onExistingLender")
    ],

    onAcceptInvite: function(newLender){
        LenderStore.onLenderInvite(newLender);
    },

    onNewLender: function(){
        this.transitionTo("newPassword");
    },

    onExistingLender: function(){
        if(UserStore.getCurrentUser().hasUserDetails){
            this.transitionTo('dashboardApplications');
        } else {
            this.transitionTo("lenderInfo", {}, {appId: this.getQuery().appId});
        }
    },

    render: function(){
        var newLender = {
            firstName: this.getQuery().firstName,
            lastName: this.getQuery().lastName,
            email: this.getQuery().email,
            organization: this.getQuery().organization,
            token: this.getQuery().token,
            appId: this.getQuery().appId
        };
        return (
                <div className="container">
                    <div className="row triple-gap-bottom">
                        <h1 className="col-xs-12 bordered-bottom">Welcome to Neosavvy, Inc.</h1>
                    </div>
                    <div className="row">
                        <div className="col-sm-5 col-sm-offset-1">
                            <Login loginType="new-invite" userData={newLender} />
                        </div>
                        <div className="col-sm-5">
                            <div className="panel panel-default">
                                <div className="panel-heading text-center">
                                    <h3>Register</h3>
                                </div>
                                <div className="row panel-body text-center">
                                    <div className="col-sm-10 col-sm-offset-1 col-xs-12">
                                        <button className="btn btn-lg btn-dark-blue triple-gap-top triple-gap-bottom" onClick={this.onAcceptInvite.bind(null, newLender)}>Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
});

module.exports = newLenderInvite;
