var React = require('react');
var Link = require('react-router').Link;

var UserActions = require('../actions/action-user');

var ErrorMessage = require('../components/component-error-msg');

var Login = React.createClass({

    render: function(){

        var errorText = "There was an error with your credentials. Please try again.";

        return (
            <form>
                <h4>Already a User?</h4>
                <input className="gap-bottom" ref="userEmail" type="email" placeholder="Email Address" />
                <input className="gap-bottom" ref="userPassword" type="password" placeholder="Password" />
                <ErrorMessage errorDisplay={this.props.error} errorMessage={errorText}/>
                <button className="block turquoise" onClick={this.onLogin}>
                    Login
                </button>
                <Link to="forgot-password">Forgot Password?</Link>
            </form>
        )
    },

    onLogin: function(e){
        e.preventDefault();

        var email = this.refs.userEmail.getDOMNode().value,
            password = this.refs.userPassword.getDOMNode().value;

        UserActions.login(email, password);
    }
});

module.exports = Login;
