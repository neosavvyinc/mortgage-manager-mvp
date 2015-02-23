var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var TabPane = require('react-bootstrap').TabPane;
var TabbedArea = require('react-bootstrap').TabbedArea;

var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');
var Navigation = require('../../components/navigation');
var LendersTable = require('./view-lender-list');
var BorrowersTable = require('./view-borrower-list');
var DocumentsTable = require('./view-document-list');

var ApplicationDetails = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    getInitialState: function(){
        return {
            userType: ''
        }
    },

    componentDidMount: function(){
        User.getUserDetails(UserStore.getCurrentUserId()).then(function(user){
            this.setState(
                {
                    userType: user.type
                }
            );
        }.bind(this));
    },

    onViewApplications: function(){
        this.transitionTo('dashboardApplications');
    },

    render: function() {
        var tabInfo = [{
                name: "Documents",
                component: ( <DocumentsTable /> )
            }],
            tabs = [];

        if(this.state.userType == 'lender'){
            tabInfo.push({
                name: 'Borrowers',
                component: ( <BorrowersTable />)
            });
        } else if(this.state.userType == 'borrower'){
            tabInfo.push({
                name: 'Lenders',
                component: ( <LendersTable />)
            });
        }

        for(var i = 0; i < tabInfo.length; i++){
            tabs.push((
                <TabPane eventKey={i} tab={tabInfo[i].name}>{tabInfo[i].component}</TabPane>
            ));
        }

        return (
            <div className="container">
                <div className="row double-gap-bottom">
                    <h1 className="bordered-bottom col-xs-12"><i className="fa fa-chevron-left pointer" onClick={this.onViewApplications}></i> Application Dashboard</h1>
                </div>
                <div className="row">
                    <div className="bordered-bottom col-xs-12">
                        <TabbedArea defaultActiveKey={0}>
                            {tabs.map(function(tab) {
                                return (tab);
                            })}
                        </TabbedArea>
                    </div>
                </div>
                <RouterHandler/>
            </div>

        );
    }
});

module.exports = ApplicationDetails;
