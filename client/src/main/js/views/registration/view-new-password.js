'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../../models/model-user');
var MessageBox = require('../../components/message-box');
var BorrowerStore = require('../../stores/store-borrower');
var LenderStore = require('../../stores/store-lender');
var BorrowerActions = require('../../actions/action-borrower');
var LenderActions = require('../../actions/action-lender');
var UserStore = require('../../stores/store-user');
var UserActions = require('../../actions/action-user');

var NewPassword = React.createClass({
    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(UserStore, 'onNewAccount')
    ],

    statics: {
        willTransitionTo: function (transition){
            if(!BorrowerStore.getBorrower().email && !LenderStore.getLender().email) {
                transition.redirect('welcome');
            }
        }
    },

    getInitialState: function(){
        return {
            passwordError: false,
            errorText: ''
        };
    },

    onCheckPassword: function(e){
        e.preventDefault();
        var newPassword = this.refs.newPassword.getDOMNode().value,
            confirmPassword = this.refs.confirmPassword.getDOMNode().value;
        if (!newPassword || newPassword === ''){
            this.setState({
                passwordError: true,
                errorText: 'Please enter a password'
            });
        } else if (newPassword !== confirmPassword){
            this.setState({
                passwordError: true,
                errorText: 'Both passwords need to match'
            });
        } else {
            var newUser = {},
                borrowerEmail = BorrowerStore.getBorrower().email,
                lenderEmail = LenderStore.getLender().email;

            if(borrowerEmail) {
                newUser.email = borrowerEmail;
                newUser.type = 'borrower';
            } else if(lenderEmail) {
                newUser.email = lenderEmail;
                newUser.type = 'lender';
                if(LenderStore.getLender().token){
                    newUser.token = LenderStore.getLender().token;
                }
            }
            newUser.password = newPassword;

            User.register(newUser).then(function(user){
                if(newUser.type === 'borrower') {
                    BorrowerActions.newPassword(newPassword);
                } else {
                    LenderActions.newPassword(newPassword);
                }
                UserActions.login(user);
            }, function(error){
                this.setState({
                    passwordError: true,
                    errorText: error.responseJSON.message ? error.responseJSON.message : error.message
                });
            }.bind(this));
        }
    },

    onNewAccount: function(){
        var borrowerEmail = BorrowerStore.getBorrower().email,
            lenderEmail = LenderStore.getLender().email;

        if(borrowerEmail) {
            this.transitionTo('applicantQuestions');
        } else if(lenderEmail) {
            if(!LenderStore.getLender().appId){
                this.transitionTo('lenderInfo');
            } else {
                this.transitionTo('lenderInfo',{},{appId:LenderStore.getLender().appId});
            }
        }
    },

    render: function() {
        return (
            <div className="container">
                <div className="gap-top">
                    <h1>We need you to give us a password so you can log in later</h1>
                    <div className="one fourth">
                        <input className="gap-bottom" type="password" ref="newPassword" placeholder="New Password" />
                        <input className="gap-bottom" type="password" ref="confirmPassword" placeholder="Confirm Password" />
                        <div className="info box gap-bottom">
                            <p>Your password should have at least:</p>
                            <ul>
                                <li>Eight characters</li>
                                <li>One lower case</li>
                                <li>One upper case</li>
                                <li>One special character (!@#~$%^&)</li>
                            </ul>
                        </div>
                        <MessageBox displayMessage={this.state.passwordError} message={this.state.errorText} type='error' />
                        <button className="block turquoise" onClick={this.onCheckPassword}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = NewPassword;
