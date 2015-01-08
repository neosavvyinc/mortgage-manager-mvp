var React = require('react');
var Link = require('react-router').Link;

var Login = require('../components/login');

var Main = React.createClass({

    onSignUpBorrower: function(){},
    onSignUpLender: function(){},

    render: function(){
        return (
            <div className="container">
                <div className="row">
                    <img className="centered" src="./assets/images/banner.png" alt="banner" />
                </div>
                <div className="row">
                    <div className="one third padded"> 
                        <h4>Are you a Borrower?</h4>
                        <form>
                            <input className="form-control" ref="borrowerEmail" type="email" placeholder="Email Address" />
                            <button className="asphalt" onClick={this.onSignUpBorrower}>
                                Signup as Borrower
                            </button>
                        </form>
                    </div>

                    <div className="one third padded">
                        <h4>Are you a Lender?</h4>
                        <form>
                            <input className="form-control" ref="lenderEmail" type="email" placeholder="Email Address" />
                            <button className="asphalt" onClick={this.onSignUpLender}>
                                Signup as Lender
                            </button>
                        </form>
                    </div>
                    <div className="one third padded">
                        <Login />
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Main;
