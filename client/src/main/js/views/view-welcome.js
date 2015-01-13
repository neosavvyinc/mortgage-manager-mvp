var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

var Login = require('../components/component-login');
var UserStore = require('../stores/store-user');
var LenderStore = require('../stores/store-lender');
var BorrowerStore = require('../stores/store-borrower');

var Main = React.createClass({

    mixins: [
        Router.Navigation,
        Reflux.listenTo(UserStore, 'onLogin'),
        Reflux.listenTo(LenderStore, 'onNewLender'),
        Reflux.listenTo(BorrowerStore, 'onNewBorrower')],

    statics: {
        willTransitionTo: function (transition){
            if(UserStore.isAuthenticated()){
                transition.redirect('dashboard');
            }
        }
    },

    getInitialState: function(){
        return {
            loginError: false
        }
    },

    render: function(){
        return (
            <div className="container triple-pad-right triple-pad-left">
                <div className="row align-center">
                    <img className="triple-gap-top triple-gap-bottom" src="./assets/images/banner.png" alt="banner" />
                </div>
                <div className="row">
                    <div className="one third padded">
                        <div className="user-section">
                        <h4>Are you a Borrower?</h4>
                        <form>
                            <input className="double-gap-bottom" ref="borrowerEmail" type="email" placeholder="Email Address" />
                            <button className="block turquoise" onClick={this.onSignUpBorrower}>
                                Signup as Borrower
                            </button>
                        </form>
                        </div>
                    </div>

                    <div className="one third padded">
                        <div className="user-section">
                        <h4>Are you a Lender?</h4>
                        <form>
                            <input className="double-gap-bottom" ref="lenderEmail" type="email" placeholder="Email Address" />
                            <button className="block turquoise" onClick={this.onSignUpLender}>
                                Signup as Lender
                            </button>
                        </form>
                        </div>
                    </div>
                    <div className="one third padded">
                        <div className="user-section">
                            <Login error={this.state.loginError}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    onLogin: function(){
        if(!UserStore.isAuthenticated()) {
            console.log("error");
            this.setState({loginError: true});
        } else {
            console.log("success");
            this.transitionTo('dashboard');
        }
    },

    onNewLender: function(){
        this.transitionTo('test');
    },

    onNewBorrower: function(){
        this.transitionTo('test');
    },

    onSignUpBorrower: function(){
        var email = this.refs.borrowerEmail.getDOMNode().value;
        //UserAction.addLender(email);

    },

    onSignUpLender: function(){
        var email = this.refs.lenderEmail.getDOMNode().value;
        //UserAction.addBorrower(email);
    }

});


module.exports = Main;
