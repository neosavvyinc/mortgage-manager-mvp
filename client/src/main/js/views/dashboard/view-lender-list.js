var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../models/model-application');
//var ApplicationStore = require('../../stores/store-application');
//var ApplicationActions = require('../../actions/action-application');

var LenderInvite = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    getInitialState: function(){
        return {
            lenders: []
        };
    },

    componentDidMount: function(){
        Application.getLenders(this.getParams().appId).then(function(lenders){
            if(this.isMounted()) {
                this.setState({
                    lenders: lenders
                });
            }
        }.bind(this));
    },

    onInviteLender: function(){
        this.transitionTo('inviteLender', {appId: this.getParams().appId});
    },

    render: function(){
        var lendersTable;

        _.forEach(this.state.lenders, function(lender){
            lendersTable.push((
                <tr>
                    <th>{lender.firstName + " " + lender.lastName}</th>
                    <th>{lender.organization}</th>
                    <th>{lender.email}</th>
                    <th>{lender.status}</th>
                    <th>
                        <div className="row">
                            <button className="btn turquoise one half">Email</button>
                            <button className="btn red one half">Delete</button>
                        </div>
                    </th>
                </tr>
            ));
        }, this);

        return (
            <div className="container">
                <div className="gap-top">
                    <h1>Lenders</h1>
                    <button className="btn turquoise" onClick={this.onInviteLender}>Invite Lender</button>
                    <table className="responsive">
                        <thead>
                            <tr>
                                <th>Lender Name</th>
                                <th>Organization</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                    {lendersTable.map(function(lender) {
                        return (lender);
                    })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = LenderInvite;
