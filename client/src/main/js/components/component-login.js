var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('../actions/action-user');
var UserStore = require('../stores/store-user');

var Login = React.createClass({

    getInitialState: function(){
        return {
            loginError: false
        }
    },

    render: function(){

        var errorClass = this.state.loginError ? "error" : "";

        return (
            <form className={errorClass}>
                <h4>Already a User?</h4>
                <input className="gap-bottom" ref="userEmail" type="email" placeholder="Email Address" />
                <input className="gap-bottom" ref="userPassword" type="password" placeholder="Password" />
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
