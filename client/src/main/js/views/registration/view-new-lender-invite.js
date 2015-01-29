var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var Navigation = require('../../components/navigation');
var LenderStore = require('../../stores/store-lender');

var newLenderInvite = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(LenderStore, "onNewLender")
    ],

    onAcceptInvite: function(){
        var newLender = {
            firstName: this.getQuery().firstName,
            lastName: this.getQuery().lastName,
            email: this.getQuery().email,
            organization: this.getQuery().organization,
            token: this.getQuery().token,
            appId: this.getQuery().appId
        };
        LenderStore.onLenderInvite(newLender);
    },

    onNewLender: function(){
        this.transitionTo("newPassword");
    },

    render: function(){
        return (
            <button className="btn blue" onClick={this.onAcceptInvite}>Proceed</button>
        );
    }
});

module.exports = newLenderInvite;
