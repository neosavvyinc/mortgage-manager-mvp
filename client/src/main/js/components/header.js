var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var UserActions = require('../actions/action-user');

var Header = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(UserStore, 'onLogoutTransition')
    ],

    getInitialState: function(){
        return {
            hasError: false,
            errorText: ""
        }
    },

    render: function(){
        return (
            <div className="row gap-top">
                <div className="container">
                    <div className="one half">
                        <h3>NeosavvyLabs</h3>
                    </div>
                    <div className="one half">
                        <button className="error one fourth skip-three" onClick={this.onLogout}>Logout</button>
                    </div>
                </div>
            </div>
        );
    },

    onLogout: function(e){
        User.logOut().then(function(){
            UserActions.logout();
        });
    },

    onLogoutTransition: function(){
        this.transitionTo('welcome');
    }


});

module.exports = Header;