var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Footer = React.createClass({

    render: function(){
        return (
            <div className="row">
                <div className="container triple-pad-bottom triple-pad-top">
                    <div className="row one centered mobile half double-gap-bottom">
                        <Link to="dashboard" className="one fifth align-center">About</Link>
                        <Link to="dashboard" className="one fifth align-center">Help</Link>
                        <Link to="dashboard" className="one fifth align-center">Jobs</Link>
                        <Link to="dashboard" className="one fifth align-center">Press</Link>
                        <Link to="dashboard" className="one fifth align-center">Legal</Link>
                    </div>
                    <div className="row one centered mobile third">
                        <div className="align-center">&copy; NeosavvyLabs 2015</div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Footer;
