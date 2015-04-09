var React = require('react');

var HeaderLogout = require('../components/header-logout'),
    Footer = require('../components/footer');


var FAQ = React.createClass({
    render: function(){
        return (
            <span>
                <div className="fill">
                    <div className="header">
                        <HeaderLogout />
                    </div>
                    <div className="content-body container">
                        <div className="panel panel-default bg-white">
                            <div className="panel-body no-pad-bottom">
                                <h2 className="bordered-bottom">Frequently Asked Questions</h2>
                            </div>
                            <div className="row">
                                <div className="dotted-bottom col-xs-12 no-pad-top no-gap-top">
                                    <h3 className="">Who would want to use DocSwap?</h3>
                                    <p>DocSwap is a platform for helping home buyers seeking conventional conforming loans exchange information with their lender.</p>
                                </div>
                                <div className="dotted-bottom col-xs-12">
                                    <h3 className="bold">What does DocSwap do for me as a borrower?</h3>
                                    <p>DocSwap allows a secure document exchange between the lender and home buyer. Via a customizable set of questions the system can help gather the documents needed from the home buyer to make the process less painful.<br/>No more Fax, Email, Print-Sign-Scan, or other manual print document exchange.</p>
                                </div>
                                <div className="dotted-bottom col-xs-12">
                                    <h3 className="bold">When would be best for me to start using DocSwap?</h3>
                                    <p>A home buyer getting organized to seek lending in the near future can use DocSwap without a lender involved, and later invite their lender.</p>
                                    <p>A lender can invite a home buyer to use DocSwap when they meet each other in the bank as a way to help facilitate document exchange required to meet a GSE 1003 compliant application.</p>
                                    </div>
                                <div className="dotted-bottom col-xs-12">
                                    <h3 className="bold">Why would I want to use DocSwap as a Lender?</h3>
                                    <p>We believe that through facilitation of better document exchange we can increase the number of 1003’s any bank can close, while increasing pull through.</p>
                                </div>
                            </div>
                        </div>
                        <div className="push" />
                    </div>
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        );
    }
});

module.exports = FAQ;