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

var NewPassword = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(ApplicationStore, 'onApplicationView')
    ],

    getInitialState: function(){
        return {
            applications: []
        }
    },

    componentDidMount: function(){
        User.getApplications(UserStore.getCurrentUser()._id).then(function(applications){
            if(this.isMounted()) {
                this.setState({
                    applications: applications
                });
            }
        }.bind(this));
    },

    render: function(){

        var applicationsTable = [],
            status;

        _.map(this.state.applications, function(app){
            switch(app.status){
                case 1:
                    status = "New Request";
                    break;
                case 2:
                    status = "New Explanation";
                    break;
                default:
                    status = "None";
                    break;
            }

            // e.g. Wednesday, January 21, 2015 3:21 PM
            app.created = moment(app.created).format('llll');
            app.lastModified = moment(app.lastModified).format('llll');
            applicationsTable.push((
                <tr>
                    <th>{app._id}</th>
                    <th>{app.created}</th>
                    <th>{app.lastModified}</th>
                    <th>{status}</th>
                    <th>
                        <div className="row">
                            <button className="btn turquoise one half" onClick={this.onApplicationSelect(app)}>View</button>
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
                                <th>ID</th>
                                <th>Last Created</th>
                                <th>Last Modified</th>
                                <th>Status</th>
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

    onApplicationSelect: function(application){
        ApplicationActions.selectApplication(application);
    },

    onApplicationTransition: function(appID){
        this.transitionTo('applications/' + appID);
    }
});

module.exports = NewPassword;
