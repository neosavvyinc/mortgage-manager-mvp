var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var User = require('../../models/model-user');
var ErrorMessage = require('../../components/error-message');
var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');
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
            if(!BorrowerStore.getBorrower().email){
                transition.redirect('welcome');
            }
        }
    },

    getInitialState: function(){
        return {
            passwordError: false,
            errorText: ""
        }
    },

    onCheckPassword: function(){
        var newPassword = this.refs.newPassword.getDOMNode().value,
            confirmPassword = this.refs.confirmPassword.getDOMNode().value;
        if(newPassword != confirmPassword){
            this.setState({
                passwordError: true,
                errorText: "Both passwords need to match"
            });
        } else {
            User.register({
                email: BorrowerStore.getBorrower().email,
                password: newPassword,
                type: "dashboard"
            }).then(function(user){
                BorrowerActions.newPassword(newPassword);
                UserActions.login(user);
            }, function(error){
                this.setState({
                    passwordError: true,
                    errorText: error.responseJSON.message
                });
            }.bind(this));
        }
    },

    onNewAccount: function(){
        this.transitionTo('applicantQuestions');
    },

    render: function(){
        return (
            <div className="container">
                <div className="gap-top">
                    <h1>We need you to give us a password so you can log in later</h1>
                    <div className="one fourth">
                        <input className="gap-bottom" type="password" ref="newPassword" placeholder="New Password" />
                        <input className="gap-bottom" type="password" ref="confirmPassword" placeholder="Confirm Password" />
                        <ErrorMessage errorDisplay={this.state.passwordError} errorMessage={this.state.errorText}/>
                        <button className="block turquoise" onClick={this.onCheckPassword}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = NewPassword;
