var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');

var ErrorMessage = require('../../components/component-error-msg');

var NewPassword = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(BorrowerStore, 'onValidPassword')
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

    render: function(){
        return (
            <div>
                <h1>We need you to give us a password so you can log in later</h1>
                <div className="one fourth">
                    <input className="gap-bottom" type="password" ref="newPassword" placeholder="New Password" />
                    <input className="gap-bottom" type="password" ref="confirmPassword" placeholder="Confirm Password" />
                    <ErrorMessage errorDisplay={this.state.passwordError} errorMessage={this.state.errorText}/>
                    <button className="info" onClick={this.onCheckPassword}>Continue</button>
                </div>
            </div>
        );
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
            BorrowerActions.newPassword(newPassword);
        }
    },

    onValidPassword: function(){
        if(BorrowerStore.isAjaxError()){
            this.setState({
                passwordError: true,
                errorText: "There was an error creating your user. Please try again."
            });
        } else {
            this.transitionTo('applicantInfo');
        }
    }
});

module.exports = NewPassword;
