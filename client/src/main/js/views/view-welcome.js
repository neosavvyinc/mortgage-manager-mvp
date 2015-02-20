'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

var Login = require('../components/login');
var MessageBox = require('../components/message-box');
var User = require('../models/model-user');
var UserStore = require('../stores/store-user');
var LenderStore = require('../stores/store-lender');
var BorrowerStore = require('../stores/store-borrower');
var BorrowerActions = require('../actions/action-borrower');
var LenderActions = require('../actions/action-lender');
var Constants = require('../constants/constants');

var Welcome = React.createClass({

    mixins: [
	    Router.State,
        Router.Navigation,
        Reflux.listenTo(UserStore, 'onLogin'),
        Reflux.listenTo(LenderStore, 'onNewLender'),
        Reflux.listenTo(BorrowerStore, 'onNewBorrower')
    ],

    statics: {
        willTransitionTo: function (transition){
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (res.isAuthenticated) {
                        if(UserStore.getCurrentUser().email) {
                            if(!UserStore.getCurrentUser().hasUserDetails) {
                                var transitionRoute = UserStore.getCurrentUser().type === 'lender' ? 'lenderInfo' : 'applicantQuestions';
                                transition.redirect(transitionRoute);
                            } else {
                                transition.redirect('dashboardApplications');
                            }
                        }
                    }
                })
            );
        }
    },

    getInitialState: function(){
        return {
            borrowerEmpty: false,
            lenderEmpty: false,
            borrowerError: false,
            borrowerErrorMessage: '',
            lenderError: false,
            lenderErrorMessage: ''
        };
    },

    onSignUpBorrower: function(e){
        e.preventDefault();
        if(this.refs.borrowerEmail.getDOMNode().value){
            var emailRegExp = new RegExp(Constants.emailRegExp);
            if(!emailRegExp.test(this.refs.borrowerEmail.getDOMNode().value)){
                this.setState({
                    borrowerError: true,
                    borrowerErrorMessage: "You have to provide a valid email",
                    lenderError: false,
                    lenderErrorMessage: ""
                });
            } else {
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
            }
        } else {
            this.setState({borrowerEmpty: true});
        }
    },

    onSignUpLender: function(e){
        e.preventDefault();
        if(this.refs.lenderEmail.getDOMNode().value){
            var emailRegExp = new RegExp(Constants.emailRegExp);
            if(!emailRegExp.test(this.refs.lenderEmail.getDOMNode().value)){
                this.setState({
                    borrowerError: false,
                    borrowerErrorMessage: "",
                    lenderError: true,
                    lenderErrorMessage: "You have to provide a valid email"
                });
            } else {
                User.emailExists(this.refs.lenderEmail.getDOMNode().value).then(
                    function () {
                        LenderActions.newLender(this.refs.lenderEmail.getDOMNode().value);
                    }.bind(this),
                    function (error) {
                        this.setState({
                            lenderError: true,
                            lenderErrorMessage: error.responseJSON.message,
                            borrowerError: false,
                            borrowerErrorMessage: ""
                        });
                    }.bind(this)
                );
            }
        } else {
            this.setState({lenderEmpty: true});
        }
    },

    onLogin: function(){
        if(!UserStore.getCurrentUser().hasUserDetails){
            var transitionRoute = UserStore.getCurrentUser().type == 'lender' ? 'lenderInfo' : 'applicantQuestions' ;
            this.transitionTo(transitionRoute);
        } else if(this.getQuery().changePassword){
            this.transitionTo('changePassword');
        } else {
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

        var borrowerEmptyClass = this.state.borrowerEmpty ? 'error message gap-bottom' : 'hidden';
        var falseEmptyClass = this.state.lenderEmpty ? 'error message gap-bottom' : 'hidden';

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
                                <MessageBox displayMessage={this.state.borrowerError} message={this.state.borrowerErrorMessage} type='error' />
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
                                <MessageBox displayMessage={this.state.lenderError} message={this.state.lenderErrorMessage} type='error' />
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
