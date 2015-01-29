var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');
var moment = require('moment');

var User = require('../models/model-user');
var ErrorMessage = require('../components/error-message');
var UserStore = require('../stores/store-user');
var ApplicationStore = require('../stores/store-application');
var ApplicationActions = require('../actions/action-application');

var Applications = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(ApplicationStore, 'onApplicationTransition')
    ],

    propTypes: {
        applications: React.PropTypes.array
    },

    getDefaultProps: function(){
        return {
            applications: []
        }
    },

    onApplicationSelect: function(application) {
        ApplicationActions.selectApplication(application);
    },

    onApplicationTransition: function(){
        this.transitionTo('dashboardDocuments', {appId: ApplicationStore.getCurrentApplication()._id});
    },

    render: function(){

        var applicationsTable = [],
            status;

        _.forEach(this.props.applications, function(app){
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
                            <button className="btn turquoise one half" onClick={this.onApplicationSelect.bind(null, app)}>View</button>
                            <button className="btn red one half">Delete</button>
                        </div>
                    </th>
                </tr>
            ));
        }, this);
        return (
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
        );
    }
});

module.exports = Applications;