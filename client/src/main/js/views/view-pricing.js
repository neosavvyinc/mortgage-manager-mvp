var React = require('react');

var HeaderLogout = require('../components/header-logout'),
    Footer = require('../components/footer');

var Pricing = React.createClass({
    render: function(){
        return (
            <span>
                <div className="fill">
                    <div className="header">
                        <HeaderLogout />
                    </div>
                    <div className="content-body">
                        <div className="row">
                            <div className="col-md-2 col-md-offset-5 col-sm-4 col-sm-offset-4 text-center">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <h2 className="bordered-bottom">Premium</h2>
                                        <ul className="list-unstyled">
                                            <li className="dotted-bottom gap-right gap-left label-lg">100$</li>
                                            <li className="dotted-bottom gap-right gap-left">Unlimited Document Upload</li>
                                            <li className="dotted-bottom gap-right gap-left">Unlimited Document View</li>
                                            <li className="dotted-bottom gap-right gap-left">5Gb Storage</li>
                                            <li className="dotted-bottom gap-right gap-left">Invite Lenders</li>
                                            <li className="dotted-bottom gap-right gap-left">Enhanced Security</li>
                                        </ul>
                                        <div className="row">
                                            <a className="btn btn-md btn-dark-blue col-sm-10 col-sm-offset-1 col-xs-12">Subscribe</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="push" />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        );
    }
});

module.exports = Pricing;