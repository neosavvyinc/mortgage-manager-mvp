var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var Navigation = require('../../components/navigation');
var LenderStore = require('../../stores/store-lender');
var UserStore = require('../../stores/store-user');
var Login = require('../../components/login');
var User = require('../../models/model-user');

var newLenderInvite = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(LenderStore, "onNewLender")
    ],

    statics: {
        willTransitionTo: function (transition){
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (res.isAuthenticated) {
                        transition.redirect('dashboardApplications');
                    }
                })
            );
        }
    },

    onAcceptInvite: function(newLender){
        LenderStore.onLenderInvite(newLender);
    },

    onNewLender: function(){
        this.transitionTo("newPassword");
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
            <div className="row triple-gap-top">
                <div className="container">
                    <div className="one centered mobile third">
                        <Login loginType="new-invite" userData={newLender} />
                        <div className="row double-gap-top">
                            <p className="two thirds">Register if you don't have an account yet</p>
                            <button className="btn blue one third half-gap-top" onClick={this.onAcceptInvite.bind(null, newLender)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = newLenderInvite;
