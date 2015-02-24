var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Footer = React.createClass({

    render: function(){
        return (
            <footer>
                <div className="container">
                    <ul className="list-inline">
                        <li className="pointer">
                            <Link to="pricing" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-1 col-sm-offset-2">Pricing</Link>
                        </li>
                        <li className="pointer">
                            <Link to="faq" className="col-md-2 col-sm-4 col-xs-12">FAQ</Link>
                        </li>
                        <li className="pointer">
                            <Link to="team" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-0 col-sm-offset-2">Team</Link>
                        </li>
                        <li className="pointer">
                            <Link to="legal" className="col-md-2 col-sm-4 col-xs-12">Legal</Link>
                        </li>
                        <li className="pointer">
                            <Link to="contact" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-0 col-sm-offset-4">Contact</Link>
                        </li>
                        <li className="pull-right pointer">
                            <div className="center-block col-xs-12 text-center">&copy; Neosavvy, Inc. 2015</div>
                        </li>
                    </ul>
                </div>
            </footer>
        );
    }

});

module.exports = Footer;
