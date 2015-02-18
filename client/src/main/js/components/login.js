var React = require('react');
var Link = require('react-router').Link;

var User = require('../models/model-user');
var UserActions = require('../actions/action-user');

var MessageBox = require('./message-box');

var _validateInfo = function(email, password) {
	return (
		email !== '' &&
		password !== ''
	);
};

var Login = React.createClass({

    getInitialState: function(){
        return {
            loginError: false,
            loginErrorText: "There was an error with your credentials. Please try again."
        }
    },

    getDefaultProps: function(){
        return {
            loginType: 'regular',
            userData: null
        };
    },

    onLogin: function(e) {
	    e.preventDefault();

	    var email = this.refs.userEmail.getDOMNode().value,
		    password = this.refs.userPassword.getDOMNode().value;

	    if (_validateInfo(email, password)) {
		    if (this.props.loginType === 'new-invite' && this.props.userData) {
			    User.addAppAndLogin(email, password, this.props.userData.token, this.props.userData.appId).then(
				    function (user) {
					    UserActions.login(user);
				    }, function (error) {
					    this.setState({
						    loginError: true,
						    loginErrorText: error.responseJSON.message
					    });
				    }.bind(this)
			    );
		    } else {
			    User.login(email, password).then(
				    function (user) {
					    UserActions.login(user);
				    }, function (error) {
					    this.setState({
						    loginError: true,
						    loginErrorText: error.responseJSON.message
					    });
				    }.bind(this)
			    );
		    }
	    } else {
		    this.setState({
			    loginError: true,
			    loginErrorText: 'You must enter both username and password.'
		    });
	    }
    },

	render: function(){
		return (
			<form>
				<h4>Already a User?</h4>
				<input className="gap-bottom" ref="userEmail" type="email" placeholder="Email Address" />
				<input className="gap-bottom" ref="userPassword" type="password" placeholder="Password" />
				<MessageBox displayMessage={this.state.loginError} message={this.state.loginErrorText} type='error'/>
				<button className="block turquoise" onClick={this.onLogin}>
					Login
				</button>
				<Link to="forgotPassword">Forgot Password?</Link>
			</form>
		)
	},
});

module.exports = Login;
