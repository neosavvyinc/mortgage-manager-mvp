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
var TabActions = require('../../actions/action-tabs');
var TabStore = require('../../stores/store-tab');
var LendersTable = require('./view-lender-list');
var BorrowersTable = require('./view-borrower-list');
var DocumentsTable = require('./view-document-list');

var ApplicationDetails = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(TabStore, "onTabChange")
    ],

    getInitialState: function(){
        return {
            userType: '',
            activeTabName: 'documents'
        }
    },

    componentWillMount: function(){
        this.setState({
            activeTabName: this.getParams().tabName
        });
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

    onTransitionTab: function(tabToTransition){
        if(tabToTransition !== this.state.activeTabName){
            TabActions.switchPanel(tabToTransition);
        }
    },

    onTabChange: function(){
        this.setState({
            activeTabName: TabStore.getNextTabName()
        });
        this.transitionTo('dashboardAppDetails', {appId: this.getParams().appId, tabName: TabStore.getNextTabName()});

    },

    render: function() {
        var tabInfo = [{
                name: "Documents",
                component: (this.state.activeTabName == 'documents' ? ( <DocumentsTable /> ) : ( <div></div> ))
            }],
            tabs = [],
            tabPanels = [],
            activeTabIndex;


        if(this.state.userType == 'lender'){
            tabInfo.push({
                name: 'Borrowers',
                component: (this.state.activeTabName == 'borrowers' ? ( <BorrowersTable /> ) : ( <div></div> ))
            });
        } else if(this.state.userType == 'borrower'){
            tabInfo.push({
                name: 'Lenders',
                component: (this.state.activeTabName == 'lenders' ? ( <LendersTable /> ) : ( <div></div> ))
            });
        }

        activeTabIndex = _.findIndex(tabInfo, function(tab) {
            return tab.name.toLowerCase() == this.state.activeTabName;
        }.bind(this));

        for(var i = 0; i < tabInfo.length; i++){
            tabs.push((
                <li className={activeTabIndex == i ? "active" : ""} onClick={this.onTransitionTab.bind(null, tabInfo[i].name.toLowerCase())}>
                    <a>{tabInfo[i].name}</a>
                </li>
            ));
            tabPanels.push(tabInfo[i].component);
        }

        return (
            <div className="container">
                <div className="row double-gap-bottom">
                    <h1 className="bordered-bottom col-xs-12"><i className="fa fa-chevron-left pointer" onClick={this.onViewApplications}></i> Application Dashboard</h1>
                </div>
                <div className="row">
                    <div className="bordered-bottom col-xs-12">
                        <div className="nav nav-tabs">
                        {tabs.map(function(tab){
                            return tab;
                        })}
                        </div>
                        {tabPanels.map(function(tab){
                            return tab;
                        })}
                    </div>
                </div>
                <RouterHandler/>
            </div>

        );
    }
});

/**
 * <div className="bordered-bottom col-xs-12">
 <TabbedArea defaultActiveKey={0}>
 {tabs.map(function(tab) {
     return (tab);
 })}
 </TabbedArea>
 </div>
 *
 *
 */

module.exports = ApplicationDetails;
