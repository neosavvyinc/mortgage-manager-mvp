var React = require('react');
var Router = require('react-router');

var UserStore = require('../stores/store-user');
var User = require('../models/model-user');

var Dashboard = React.createClass({

    mixins: [Router.State],

    statics: {
        willTransitionTo: function (transition){
            if(!UserStore.isAuthenticated()){
                transition.redirect('main');
            }
        }
    },

    getInitialState: function(){
        return {
            currentUser: UserStore.getCurrentUser()
        }
    },

    render: function(){
        return (
            <div>
                <h1>I'm a dashboard</h1>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</div>
                <p>{this.state.currentUser.email}</p>
            </div>
        )
    }
});

module.exports = Dashboard;
