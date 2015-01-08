var React = require('react');
var Link = require('react-router').Link;

var Login = React.createClass({
    statics: {
        attemptedLogin: null
    },

    getInitialState: function(){
        return {
            error: false
        }
    },
    onLogin: function(e){
        e.preventDefault();
        console.log("authenticating...");
    },
    render: function(){
        return (
            <form>
                <input ref="userEmail" type="email" placeholder="Email Address" />
                <input ref="userPassword" type="password" placeholder="Password" />
                <button className="asphalt" onClick={this.onLogin}>
                    Login
                </button>
            </form>

        )
    }
});

module.exports = Login;
