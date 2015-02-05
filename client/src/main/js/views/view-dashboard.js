var React = require('react');
var Router = require('react-router');
var RouterHandler = Router.RouteHandler;
var Reflux = require('reflux');

var User = require('../models/model-user');
var UserStore = require('../stores/store-user');

var Header = require('../components/header');
var Footer = require('../components/footer');
var Navigation = require('../components/navigation');

var Dashboard = React.createClass({

    mixins: [
        Router.State
    ],

    statics: {
        willTransitionTo: function (transition){
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (!res.isAuthenticated) {
                        transition.redirect('welcome');
                    }
                })
            );
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
