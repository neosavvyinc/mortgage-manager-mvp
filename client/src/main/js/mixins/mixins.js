var React = require('react');
var User = require('../models/user');
var Navigation = require('react-router').Navigation;

var IsAuthenticated = {
    componentWillMount: function(){
        console.log("::: authentication check :::");
        User.isAuthenticated(this.props.user).then(function(foo){
            console.log("Foo ::: ", foo);

        },function(bar){
            console.log("Bar ::: ", bar);
            Navigation.transitionTo("main",{loginError: true});
            console.log("HODOR!");
        });
    }
};

var Mixins = {
    isAuthenticated: IsAuthenticated
};

module.exports = Mixins;
