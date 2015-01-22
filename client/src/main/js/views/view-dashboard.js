var React = require('react');
var Router = require('react-router');
var RouterHandler = Router.RouteHandler;
var Reflux = require('reflux');

var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var UserActions = require('../actions/action-user');

var Header = require('../components/header');
var Footer = require('../components/footer');
var Navigation = require('../components/navigation');

var Dashboard = React.createClass({

    mixins: [
        Router.State
    ],

    statics: {
        willTransitionTo: function (transition){
            console.log("authentication", UserStore.isAuthenticated(), UserStore.getCurrentUser());

            if(!UserStore.isAuthenticated()){
                transition.redirect('welcome');
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
                <Header />
                <Navigation />
                <RouterHandler />
                <Footer />
            </div>
        )
    }

});

module.exports = Dashboard;
