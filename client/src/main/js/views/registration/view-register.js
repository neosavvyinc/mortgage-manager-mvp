'use strict';

var React = require('react');
var Router = require('react-router');
var RouterHandler = require('react-router').RouteHandler;
var Reflux = require('reflux');

var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');

var Header = require('../../components/header');
var HeaderLogout = require('../../components/header-logout');
var Footer = require('../../components/footer');

var moment = require('moment');

var Dashboard = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(UserStore, "onAuthentication")
    ],

    getInitialState: function(){
        return {
            isAuthenticated: false
        };
    },

    componentDidMount: function() {
        User.isAuthenticated(UserStore.getCurrentUserId()).then(
            function(res) {
                if(res.isAuthenticated){
                    this.setState({
                        isAuthenticated: true
                    });
                }
            }.bind(this));
    },

    onAuthentication: function() {
        if(UserStore.getCurrentUser() != {}){
            this.setState({
                isAuthenticated: true
            });
        }
    },

    render: function(){
        var header = this.state.isAuthenticated ? (<Header />) : (<HeaderLogout />);
        return (
            <span>
                <div className="dashboard-fill" style={{backgroundColor:'white'}}>
                    <div className="header">
                    {header}
                    </div>
                    <div className="register-body">
                        <RouterHandler />
                    </div>
                    <div className="push" />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        )
    }
});

module.exports = Dashboard;
