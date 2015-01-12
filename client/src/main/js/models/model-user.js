var Q = require('q');
var _ = require('lodash');
var $ = require('jquery');

var Endpoints = require("../constants/endpoints");

function User () { }

User.login = function (email, password){
    return Q.promise(function(resolve, reject){
        setTimeout(function(){
            if(email == "pablo@gmail.com")
                resolve({email:"pablo@gmail.com", other: true});
            else
                reject({msg: "error logging in"});
        }, 1000);
        /*$.post(Endpoints.LOGIN, {
            email: email,
            password: password
        },function(success){
            resolve(success);
        }, function(error){
            reject(error);
        });*/
    });
};

module.exports = User;
