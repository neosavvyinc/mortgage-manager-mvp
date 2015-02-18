var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');

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
            activeTab: 0,
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

    activateTab: function(tabToActivate){
        if(this.state.activeTab != tabToActivate){
            this.setState({
                activeTab: tabToActivate
            });
        }
    },

    onViewApplications: function(){
        this.transitionTo('dashboardApplications');
    },

    render: function() {

        var tabInfo = [{
                name: "Documents",
                classToActivate: "documentsTab",
                component: ( <DocumentsTable /> )
            }],
            tabs = [],
            panels = [];

        if(this.state.userType == 'lender'){
            tabInfo.push({
                name: 'Borrowers',
                classToActivate: "contactsTab",
                component: ( <BorrowersTable />)
            });
        } else if(this.state.userType == 'borrower'){
            tabInfo.push({
                name: 'Lenders',
                classToActivate: "contactsTab",
                component: ( <LendersTable />)
            });
        }

        for(var i = 0; i < tabInfo.length; i++){
            tabs.push((
                <li role="tab" aria-controls={"." + tabInfo[i].classToActivate} className={(this.state.activeTab === i) ? "active" : ""} onClick={this.activateTab.bind(null, i)}>{tabInfo[i].name}</li>
            ));
            panels.push((
                <div role="tabpanel" className={tabInfo[i]} className={(this.state.activeTab === i) ? "active" : ""}>
                {tabInfo[i].component}
                </div>
            ));
        }

        return (
            <div className="container">
                <div className="gap-top">
                    <div className="row">
                        <h2><span className="tooltip" data-tooltip="Back"><i className="fa fa-chevron-left pointer" onClick={this.onViewApplications}></i></span> Application Dashboard</h2>
                    </div>
                    <div className="tabs ipad">
                        <ul role="tablist">
                         {tabs.map(function(tab) {
                             return (tab);
                         })}
                        </ul>
                        {panels.map(function(panel) {
                            return (panel);
                        })}
                    </div>
                </div>
                <RouterHandler/>
            </div>
        );
    }
});

module.exports = ApplicationDetails;
