var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Footer = React.createClass({

    render: function(){
        return (
            <footer>
                <div className="container">
                    <ul className="list-inline">
                        <li>
                            <Link to="welcome" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-1 col-sm-offset-2">About</Link>
                        </li>
                        <li>
                            <Link to="welcome" className="col-md-2 col-sm-4 col-xs-12">Help</Link>
                        </li>
                        <li>
                            <Link to="welcome" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-0 col-sm-offset-2">Jobs</Link>
                        </li>
                        <li>
                            <Link to="welcome" className="col-md-2 col-sm-4 col-xs-12">Press</Link>
                        </li>
                        <li>
                            <Link to="welcome" className="col-md-2 col-sm-4 col-xs-12 col-md-offset-0 col-sm-offset-4">Legal</Link>
                        </li>
                        <li className="pull-right">
                            <div className="center-block col-xs-12 text-center">&copy; Neosavvy, Inc. 2015</div>
                        </li>
                    </ul>
                </div>
            </footer>
        );
    }

});

module.exports = Footer;
