var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var Settings = require('./header-settings');

var Header = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    render: function() {
        return (
            <div className="navbar navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header page-scroll col-xs-6">
                        <div className="navbar-brand page-scroll pointer">ShuttleDoc</div>
                    </div>
                    <div className="col-xs-6">
                        <div className="nav navbar-nav pull-right">
                            <Settings/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Header;

/**
 <div className="navbar navbar-default">
 <div className="container">
 <div className="col-xs-6">
 <div className="nav navbar-nav">
 <a href="http://www.neosavvy.com/" className="navbar-brand"> Neosavvy, Inc.</a>
 </div>
 </div>
 <div className="col-xs-6">
 <div className="nav navbar-nav pull-right">
 <Settings/>
 </div>
 </div>
 </div>
 </div>
 **/