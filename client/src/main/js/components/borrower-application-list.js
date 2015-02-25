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

var BorrowerApplications = React.createClass({

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
        this.transitionTo('dashboardAppDetails', {appId: ApplicationStore.getCurrentApplication()._id, tabName:'documents'});
    },

    render: function(){

        var applicationsTable = [],
            status,
            actions = [];

	    var actionStyle = {
		    width: '12%'
	    }, statusStyle ={
		    width: '16%'
	    }, nameColStyle ={
		    width: '18%'
	    }, otherColStyle ={
		    width: '27%'
	    };

        _.forEach(this.props.applications, function(app){
            switch(app.status){
                case 1:
                    status = 'New Request';
                    break;
                case 2:
                    status = 'New Explanation';
                    break;
                default:
                    status = 'None';
                    break;
            }

            // e.g. Wednesday, January 21, 2015 3:21 PM
            app.created = moment(app.created).format('llll');
            app.lastModified = moment(app.lastModified).format('llll');
            applicationsTable.push((
                <tr>
	                <th>Mortgage Application</th>
                    <th>{app.created}</th>
                    <th>{app.lastModified}</th>
                    <th>{status}</th>
                    <th>
                        <div className="row">
                            <button className="btn btn-dark-blue btn-xs" onClick={this.onApplicationSelect.bind(null, app)}>View <i className="fa fa-binoculars"></i></button>
                        </div>
                    </th>
                </tr>
            ));
        }, this);
        return (
            <div>
                <Navigation navigationItems={actions}/>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <col style={nameColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={statusStyle}/>
                        <col style={actionStyle}/>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Created</th>
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
    }
});

module.exports = BorrowerApplications;
