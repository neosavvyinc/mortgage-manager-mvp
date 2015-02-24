var React = require('react');
var Router = require('react-router'),
    Link = Router.Link;
var Reflux = require('reflux');

var HeaderLogout = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    render: function() {
        return (
            <div className="navbar navbar-fixed-top navbar-logout">
                <div className="container">
                    <div className="navbar-header page-scroll">
                        <Link className="navbar-brand page-scroll pointer" to='welcome'>ShuttleDoc</Link>
                    </div>
                    <div className="collapse navbar-collapse navbar-ex1-collapse">
                        <ul className="nav navbar-nav">
                            <li className="pointer">
                                <Link to='pricing'>Pricing</Link>
                            </li>
                            <li className="pointer">
                                <Link to='faq'>FAQ</Link>
                            </li>
                            <li className="pointer">
                                <Link to='team'>Team</Link>
                            </li>
                            <li className="pointer">
                                <Link to='legal'>Legal</Link>
                            </li>
                            <li className="pointer">
                                <Link to='contact'>Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = HeaderLogout;