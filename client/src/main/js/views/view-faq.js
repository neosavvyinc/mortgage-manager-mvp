var React = require('react');

var HeaderLogout = require('../components/header-logout');

var FAQ = React.createClass({
    render: function(){
        return (
            <div>
                <div className="header">
                    <HeaderLogout />
                </div>
                <div className="content-body">
                    <div className="content-body container">
                        <div className="panel panel-default bg-white">
                            <div className="panel-body no-pad-bottom">
                                <h2 className="bordered-bottom">Frequent Asked Questions</h2>
                            </div>
                            <div className="row">
                                <div className="dotted-bottom col-xs-12 no-pad-top no-gap-top">
                                    <h3 className="">Question Number One?</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                                <div className="dotted-bottom col-xs-12">
                                    <h4 className="bold">Question Number Two?</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                                <div className="dotted-bottom col-xs-12">
                                    <h4 className="bold">Question Number Three?</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FAQ;