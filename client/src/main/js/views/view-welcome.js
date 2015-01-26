var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

var Login = require('../components/login');
var ErrorMessage = require('../components/error-message');
var User = require('../models/model-user');
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
            lenderEmpty: false,
            borrowerError: false,
            borrowerErrorMessage: "",
            lenderError: false,
            lenderErrorMessage: ""
        }
    },

    onSignUpBorrower: function(){
        if(this.refs.borrowerEmail.getDOMNode().value){
            User.emailExists(this.refs.borrowerEmail.getDOMNode().value).then(
                function(){
                    BorrowerActions.newBorrower(this.refs.borrowerEmail.getDOMNode().value);
                }.bind(this),
                function(error){
                    this.setState({
                        borrowerError: true,
                        borrowerErrorMessage: error.responseJSON.message,
                        lenderError: false,
                        lenderErrorMessage: ""
                    });
                }.bind(this)
            );
        } else {
            this.setState({borrowerEmpty: true});
        }
    },

    onSignUpLender: function(){
        if(this.refs.lenderEmail.getDOMNode().value){
            User.emailExists(this.refs.lenderEmail.getDOMNode().value).then(
                function() {
                    LenderActions.newLender(this.refs.lenderEmail.getDOMNode().value);
                }.bind(this),
                function(error){
                    this.setState({
                        lenderError: true,
                        lenderErrorMessage: error.responseJSON.message,
                        borrowerError: false,
                        borrowerErrorMessage: ""
                    });
                }.bind(this)
            );
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
                                <ErrorMessage errorDisplay={this.state.borrowerError} errorMessage={this.state.borrowerErrorMessage} />
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
                                <ErrorMessage errorDisplay={this.state.lenderError} errorMessage={this.state.lenderErrorMessage} />
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
