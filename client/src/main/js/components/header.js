var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var NavBar = require('./header-navbar');

var Header = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    render: function() {
        return (
            <div className="navbar navbar-default">
                <div className="container">
                    <div className="col-xs-6">
                        <div className="nav navbar-nav">
                            <a href="http://www.neosavvy.com/" className="navbar-brand"> Neosavvy, Inc.</a>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="nav navbar-nav pull-right">
                            <NavBar/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Header;