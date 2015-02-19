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
            <div className="row gap-top padded">
                <div className="container">
                    <div className="one half">
                        <h3><a href="http://www.neosavvy.com/"> Neosavvy, Inc.</a></h3>
                    </div>
                    <div className="one half align-right">
	                    <NavBar/>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Header;