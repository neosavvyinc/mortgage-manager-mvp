var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Footer = React.createClass({

    render: function(){
        return (
            <footer>
                <div className="container">
                    <ul className="list-inline hidden-xs">
                        <li className="pointer">
                            <Link to="pricing" className="col-md-2 col-sm-4 col-md-offset-0 col-sm-offset-2">Pricing</Link>
                        </li>
                        <li className="pointer">
                            <Link to="faq" className="col-md-2 col-sm-4 col-md-offset-0 col-sm-offset-2">FAQ</Link>
                        </li>
                        <li className="pointer">
                            <Link to="team" className="col-md-2 col-sm-4 col-md-offset-0 col-sm-offset-2">Team</Link>
                        </li>
                        <li className="pointer">
                            <Link to="legal" className="col-md-2 col-sm-4 col-md-offset-0 col-sm-offset-2">Legal</Link>
                        </li>
                        <li className="pointer">
                            <Link to="contact" className="col-md-2 col-sm-4 col-md-offset-0 col-sm-offset-4">Contact</Link>
                        </li>
                        <li className="pull-right">
                            <div className="center-block text-center">&copy; Neosavvy, Inc. 2015</div>
                        </li>
                    </ul>
                    <div className="row hidden-sm hidden-md hidden-lg">
                        <div className="blue gap-bottom col-xs-12 text-center pointer">
                            <Link to="pricing">Pricing</Link>
                        </div>
                        <div className="blue gap-bottom col-xs-12 text-center pointer">
                            <Link to="faq">FAQ</Link>
                        </div>
                        <div className="blue gap-bottom col-xs-12 text-center pointer">
                            <Link to="team">Team</Link>
                        </div>
                        <div className="blue gap-bottom col-xs-12 text-center pointer">
                            <Link to="legal">Legal</Link>
                        </div>
                        <div className="blue gap-bottom col-xs-12 text-center pointer">
                            <Link to="contact">Contact</Link>
                        </div>
                        <div className="white center-block gap-top gap-bottom col-xs-12 text-center">&copy; Neosavvy, Inc. 2015</div>
                    </div>
                </div>
            </footer>
        );
    }

});

module.exports = Footer;
