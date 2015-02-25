var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../../models/model-application');
var Navigation = require('../../../components/navigation');

var BorrowerContacts = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    getInitialState: function(){
        return {
            borrowers: []
        };
    },

    componentDidMount: function(){
        Application.getBorrowers(this.getParams().appId).then(function(borrowers){
            if(this.isMounted()){
                this.setState({
                    borrowers: borrowers
                });
            }
        }.bind(this));
    },

    render: function(){
        var borrowersTable = [];

        var actions = [
        ];

        _.forEach(this.state.borrowers, function(borrower){
            borrowersTable.push((
                <tr>
                    <th>{borrower.firstName + " " + borrower.lastName}</th>
                    <th>{borrower.address + " " + borrower.city + ", " + borrower.state + " " + borrower.zip}</th>
                    <th>{borrower.email}</th>
                    <th>{borrower.phone}</th>
                </tr>
            ));
        }, this);
        return (
            <div className="container">
                <div className="gap-top">
                    <h2>Lenders</h2>
                    <Navigation navigationItems={actions}/>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Applicant's Name</th>
                                    <th>Address</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                        {borrowersTable.map(function(borrower) {
                            return (borrower);
                        })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = BorrowerContacts;
