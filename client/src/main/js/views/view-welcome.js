var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

var Login = require('../components/login');
var HeaderLogout = require('../components/header-logout');
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
                            } else if(UserStore.getCurrentUser().pendingReset) {
	                            transition.redirect('change-password');
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
            this.setState({
                borrowerError: true,
                borrowerErrorMessage: "You need to provide a valid email"
            });
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
            this.setState({
                lenderError: true,
                lenderErrorMessage: "You need to provide a valid email"
            });
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
        return (
            <div>
                <div className="header-welcome alt vert">
                    <HeaderLogout />
                    <div className="container">
                        <h1 className="hidden-xs">ShuttleDoc</h1>
                        <h2 className="hidden-sm hidden-md hidden-lg">ShuttleDoc</h2>
                        <p className="lead">The mortgage application process is totally broken. We plan to make it a much smoother experience.</p>
                        <div>&nbsp;</div>
                        <Link className="btn btn-default btn-lg" to='pricing'>Find Your Plan</Link>
                    </div>
                </div>
                <div className="blurb bright">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 col-md-offset-1 col-sm-5 col-sm-offset-1 col-xs-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading text-center">
                                        <h3>Register</h3>
                                    </div>
                                    <div className="panel-body text-center">
                                        <form>
                                            <div className="form-group">
                                                <input className="form-control" ref="borrowerEmail" type="email" placeholder="Email Address" />
                                            </div>
                                            <div className="form-group">
                                                <MessageBox displayMessage={this.state.borrowerError} message={this.state.borrowerErrorMessage} type='error' />
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-default col-xs-12" onClick={this.onSignUpBorrower}>
                                                    Signup as Borrower
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 hidden">
                                <div className="panel panel-default">
                                    <div className="panel-heading text-center">
                                        <h3>Are you a Lender?</h3>
                                    </div>
                                    <div className="panel-body text-center">
                                        <form>
                                            <div className="form-group">
                                                <input className="form-control" ref="lenderEmail" type="email" placeholder="Email Address" />
                                            </div>
                                            <div className="form-group">
                                                <MessageBox displayMessage={this.state.lenderError} message={this.state.lenderErrorMessage} type='error' />
                                            </div>
                                            <div className="form-group">
                                                <button className="btn btn-default col-xs-12" onClick={this.onSignUpLender}>
                                                    Signup as Lender
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-md-offset-2 col-sm-5 col-xs-12">
                                <Login />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Welcome;
