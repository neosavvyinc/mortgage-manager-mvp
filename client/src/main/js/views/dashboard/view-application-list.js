var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');
var moment = require('moment');

var User = require('../../models/model-user');
var MessageBox = require('../../components/message-box');
var ApplicationLenderList = require('../../components/lender-application-list');
var ApplicationBorrowerList = require('../../components/borrower-application-list');
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
            applications: [],
            userType: ''
        };
    },

    componentDidMount: function(){
        User.getApplications(UserStore.getCurrentUserId()).then(function(applications){
            if(this.isMounted()) {
                this.setState({
                    applications: applications
                });
            }
        }.bind(this));

        User.getUserDetails(UserStore.getCurrentUserId()).then(function(userDetails){
            if(this.isMounted()){
                this.setState({
                    userType: userDetails.type
                });
            }
        }.bind(this));
    },

    onApplicationSelect: function(application) {
        ApplicationActions.selectApplication(application);
    },

    onApplicationTransition: function(){
        this.transitionTo('dashboardDocuments', {appId: ApplicationStore.getCurrentApplication()._id, tab:0});
    },

    render: function(){

        var userApplications;

        if(this.state.userType === 'lender') {
            userApplications = (
                <ApplicationLenderList applications={this.state.applications} />
            );
        } else if(this.state.userType === 'borrower'){
            userApplications = (
                <ApplicationBorrowerList applications={this.state.applications} />
            );
        }

        return (
            <div className="container">
                <div className="row double-gap-bottom">
                    <div className="row">
                        <h1 className="bordered-bottom col-xs-12 ">Applications</h1>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            {userApplications}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Applications;
