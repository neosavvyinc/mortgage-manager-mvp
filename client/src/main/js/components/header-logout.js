var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var HeaderLogout = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    render: function() {
        return (
            <div className="navbar navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header page-scroll">
                        <div className="navbar-brand page-scroll pointer" onClick={this.transitionTo.bind(null, 'welcome')}>ShuttleDoc</div>
                    </div>
                    <div className="collapse navbar-collapse navbar-ex1-collapse">
                        <ul className="nav navbar-nav">
                            <li className="pointer">
                                <a onClick={this.transitionTo.bind(null, 'pricing')}>Pricing</a>
                            </li>
                            <li className="pointer">
                                <a onClick={this.transitionTo.bind(null, 'faq')}>FAQ</a>
                            </li>
                            <li className="pointer">
                                <a onClick={this.transitionTo.bind(null, 'team')}>Team</a>
                            </li>
                            <li className="pointer">
                                <a onClick={this.transitionTo.bind(null, 'legal')}>Legal</a>
                            </li>
                            <li className="pointer">
                                <a onClick={this.transitionTo.bind(null, 'contact')}>Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = HeaderLogout;