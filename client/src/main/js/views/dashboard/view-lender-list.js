var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../models/model-application');
var Navigation = require('../../components/navigation');
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

    render: function(){
        var lendersTable = [];

        var actions = [
            {
                tabName: "Invite Lender",
                tabLink: {
                    name: "inviteLender",
                    params: [{
                        appId: this.getParams().appId
                    }]
                }
            }
        ];

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
                    <h2>Lenders</h2>
                    <Navigation navigationItems={actions}/>
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
