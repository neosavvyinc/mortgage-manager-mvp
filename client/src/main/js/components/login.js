var React = require('react');
var Link = require('react-router').Link;

var User = require('../models/model-user');
var UserActions = require('../actions/action-user');

var ErrorMessage = require('../components/error-message');

var Login = React.createClass({

    getInitialState: function(){
        return {
            loginError: false,
            loginErrorText: "There was an error with your credentials. Please try again."
        }
    },

    onLogin: function(e){
        e.preventDefault();

        var email = this.refs.userEmail.getDOMNode().value,
            password = this.refs.userPassword.getDOMNode().value;

        User.login(email, password).then(
            function(user){
                UserActions.login(user);
            }, function(error){
                this.setState({
                    loginError:true,
                    loginErrorText: error.responseJSON.message
                });
            }.bind(this)
        );
    },
    
    render: function(){
        return (
            <form>
                <h4>Already a User?</h4>
                <input className="gap-bottom" ref="userEmail" type="email" placeholder="Email Address" />
                <input className="gap-bottom" ref="userPassword" type="password" placeholder="Password" />
                <ErrorMessage errorDisplay={this.state.loginError} errorMessage={this.state.loginErrorText}/>
                <button className="block turquoise" onClick={this.onLogin}>
                    Login
                </button>
                <Link to="forgotPassword">Forgot Password?</Link>
            </form>
        )
    },
});

module.exports = Login;
