var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');
var moment = require('moment');

var User = require('../../models/model-user');
var ErrorMessage = require('../../components/error-message');
var UserStore = require('../../stores/store-user');
var ApplicationStore = require('../../stores/store-application');
var ApplicationActions = require('../../actions/action-application');

var Applications = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(ApplicationStore, 'onApplicationTransition')
    ],

    getInitialState: function(){
        return {
            applications: []
        }
    },

    componentDidMount: function(){
        User.getApplications(UserStore.getCurrentUserId()).then(function(applications) {
            if (this.isMounted()) {
                this.setState({
                    applications: applications
                });
            }
        }.bind(this));
    },

    render: function(){

        var applicationsTable = [];

        _.map(this.state.applications, function(app){
            // e.g. Wednesday, January 21, 2015 3:21 PM
            app.lastModified = moment(app.lastModified).format('llll');
            applicationsTable.push((
                <tr>
                    <th>{app.primaryFirstName + " " + app.primaryLastName}</th>
                    <th>{app.coappFirstName + " " + app.coappLastName}</th>
                    <th>{app.lastModified || "None"}</th>
                    <th>
                        <div className="row">
                            <button className="btn turquoise one half" onClick={this.onApplicationSelect.bind(null, app)}>View</button>
                            <button className="btn red one half">Delete</button>
                        </div>
                    </th>
                </tr>
            ));
        }, this);
        return (
            <div className="container">
                <div className="gap-top">
                    <h1>Applications</h1>
                    <table className="responsive">
                        <thead>
                            <tr>
                                <th>Primary Applicant</th>
                                <th>Co-Applicant</th>
                                <th>Last Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {applicationsTable.map(function(application) {
                            return (application);
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },

    onApplicationSelect: function(application) {
        //ApplicationActions.selectApplication(application);
    },

    onApplicationTransition: function(){
        //this.transitionTo('dashboardDocuments', {appId: ApplicationStore.getCurrentApplication()._id});
    }
});

module.exports = Applications;
