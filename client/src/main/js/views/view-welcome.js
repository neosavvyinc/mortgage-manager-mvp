var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

var Login = require('../components/login');
var UserStore = require('../stores/store-user');
var LenderStore = require('../stores/store-lender');
var BorrowerStore = require('../stores/store-borrower');
var BorrowerActions = require('../actions/action-borrower');
var LenderActions = require('../actions/action-lender');

var Welcome = React.createClass({

    mixins: [
        Router.Navigation,
        Reflux.listenTo(UserStore, 'onLogin'),
        Reflux.listenTo(LenderStore, 'onNewLender'),
        Reflux.listenTo(BorrowerStore, 'onNewBorrower')],

    statics: {
        willTransitionTo: function (transition){
            if(UserStore.isAuthenticated()){
                transition.redirect('dashboardApplications');
            }
        }
    },

    getInitialState: function(){
        return {
            borrowerEmpty: false,
            lenderEmpty: false
        }
    },

    onSignUpBorrower: function(){
        if(this.refs.borrowerEmail.getDOMNode().value){
            BorrowerActions.newBorrower(this.refs.borrowerEmail.getDOMNode().value);
        } else {
            this.setState({borrowerEmpty: true});
        }
    },

    onSignUpLender: function(){
        if(this.refs.lenderEmail.getDOMNode().value){
            LenderActions.newLender(this.refs.lenderEmail.getDOMNode().value);
        } else {
            this.setState({lenderEmpty: true});
        }
    },

    onLogin: function(){
        if(UserStore.isAuthenticated()) {
            this.transitionTo('dashboardApplications');
        }
    },

    onNewLender: function(){
        this.transitionTo('newPassword');
    },

    onNewBorrower: function(){
        this.transitionTo('newPassword');
    },

    render: function(){

        var borrowerEmptyClass = this.state.borrowerEmpty ? "error message gap-bottom" : "hidden";
        var falseEmptyClass = this.state.lenderEmpty ? "error message gap-bottom" : "hidden";

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
                                <div className={borrowerEmptyClass}>You need to provide a valid email</div>
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
                                <div className={falseEmptyClass}>You need to provide a valid email</div>
                                <button className="block turquoise" onClick={this.onSignUpLender}>
                                    Signup as Lender
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="one third padded">
                        <div className="user-section">
                            <Login />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});


module.exports = Welcome;
