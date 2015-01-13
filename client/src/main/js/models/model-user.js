var Q = require('q');
var _ = require('lodash');
var $ = require('jquery');

var Endpoints = require("../constants/endpoints");

function User () { }

User.login = function (email, password){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.LOGIN, {
            email: email,
            password: password
        }).success(function(response){
            resolve(response);
        }).error(function(error){
            reject(error);
        });
    });
};

User.register = function (newUser){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.REGISTER, newUser)
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
}

module.exports = User;
