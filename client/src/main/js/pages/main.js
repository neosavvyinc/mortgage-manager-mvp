var React = require('react');
var Link = require('react-router').Link;

var Main = React.createClass({

    onSignUpBorrower: function(){},
    onSignUpLender: function(){},
    onLogin: function(){},

    render: function(){
        return (
            <div>
                <div className="row">
                    <img className="col-md-12" src="./assets/images/banner.png" alt="banner" />
                </div>
                <div className="row">
                    <div className="col-md-4"> 
                        <h4>Are you a Borrower?</h4>
                        <form>
                            <input className="form-control" ref="borrowerEmail" type="email" placeholder="Email Address" />
                            <button className="btn btn-md btn-primary btn-block" onClick={this.onSignUpBorrower}>
                                Signup as Borrower
                            </button>
                        </form>
                    </div>

                    <div className="col-md-4">
                        <h4>Are you a Lender?</h4>
                        <form>
                            <input className="form-control" ref="lenderEmail" type="email" placeholder="Email Address" />
                            <button className="btn btn-md btn-primary btn-block" onClick={this.onSignUpLender}>
                                Signup as Lender
                            </button>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <form>
                            <input className="form-control" ref="userEmail" type="email" placeholder="Email Address" />
                            <input className="form-control" ref="userPassword" type="password" placeholder="Password" />
                            <button className="btn btn-md btn-primary btn-block" onClick={this.onLogin}>
                                Login
                            </button>
                            <Link to="test">Forgot Password?</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Main;
