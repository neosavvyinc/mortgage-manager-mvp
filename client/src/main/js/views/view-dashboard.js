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
                <h4 className="col-md-8">Roy Batty: I have… seen things you people wouldnt believe… Attack ships on fire off the shoulder of Orion. I watched c-beams glitter in the dark near the Tannhäuser Gate. All those… moments… will be lost in time, like [small cough] tears… in… rain. Time… to die…</h4>
                <p>{this.state.currentUser}</p>
            </div>
        )
    }
});

module.exports = Dashboard;
