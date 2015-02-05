var React = require('react');
var Router = require('react-router');
var RouterHandler = require('react-router').RouteHandler;
var Reflux = require('reflux');

var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');
var Link = require('react-router').Link;

var Header = require('../../components/header');
var Footer = require('../../components/footer');

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
                <RouterHandler />
                <Footer />
            </div>
        )
    }
});

module.exports = Dashboard;
