var React = require('react');

var HeaderLogout = require('../components/header-logout'),
    Footer = require('../components/footer');

var Team = React.createClass({
    render: function(){
        return (
            <span>

                <div className="fill">
                    <div className="header">
                        <HeaderLogout />
                    </div>
                    <div className="content-body">
                        <div className="container">
                            <div className="panel panel-default bg-white">
                                <div className="panel-body triple-pad-bottom">
                                    <div className="row">
                                        <h2 className="bordered-bottom col-xs-12 text-center">Our Team</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <img src="assets/images/aparrish.png" width="300" height="300" />
                                            <h4 className="bordered-bottom double-pad-top text-center">Adam Parrish</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <img src="assets/images/tewen.png" width="300" height="300" />
                                            <h4 className="bordered-bottom double-pad-top text-center">Trevor Ewen</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <img src="assets/images/ccaplinger.png" width="300" height="300" />
                                            <h4 className="bordered-bottom double-pad-top text-center">Chris Caplinger</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <img src="assets/images/palonso.png" width="300" height="300" />
                                            <h4 className="bordered-bottom double-pad-top text-center">Pablo Alonso</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <img src="assets/images/sushi.png" width="300" height="300" />
                                            <h4 className="bordered-bottom double-pad-top text-center">Sushindhran Harikrishnan</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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

module.exports = Team;