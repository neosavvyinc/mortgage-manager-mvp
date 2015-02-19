var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');
var moment = require('moment');

var User = require('../models/model-user');
var MessageBox = require('./message-box');
var Navigation = require('../components/navigation');
var UserStore = require('../stores/store-user');
var ApplicationStore = require('../stores/store-application');
var ApplicationActions = require('../actions/action-application');

var LenderApplications = React.createClass({

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

    render: function(){

        var applicationsTable = [],
            actions = [];

	    var actionStyle = {
		    width: '10%'
	    }, otherColStyle ={
		    width: '30%'
	    };

        _.forEach(this.props.applications, function(app){
            if(app) {
                // e.g. Wednesday, January 21, 2015 3:21 PM
                app.lastModified = moment(app.lastModified).format('llll');
                applicationsTable.push((
                    <tr>
                        <th>{app.primaryFirstName + " " + app.primaryLastName}</th>
                        <th>{app.coappFirstName ? (app.coappFirstName + " " + app.coappLastName) : "None"}</th>
                        <th>{app.lastModified || "None"}</th>
                        <th>
                            <div className="row">
	                            <button className="btn red" onClick={this.onApplicationSelect.bind(null, app)}>View <i className="fa fa-binoculars"></i></button>
                            </div>
                        </th>
                    </tr>
                ));
            }
        }, this);
        return (
            <div>
                <Navigation navigationItems={actions}/>
                <table className="responsive">
	                <col style={otherColStyle}/>
	                <col style={otherColStyle}/>
	                <col style={otherColStyle}/>
	                <col style={actionStyle}/>
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
        );
    },

    onApplicationSelect: function(application) {
        ApplicationActions.selectApplication(application);
    },

    onApplicationTransition: function(){
        this.transitionTo('dashboardDocuments', {appId: ApplicationStore.getCurrentApplication()._id, tab:0});
    }
});

module.exports = LenderApplications;
