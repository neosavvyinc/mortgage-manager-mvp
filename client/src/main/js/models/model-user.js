var Q = require('q');
var _ = require('lodash');
var $ = require('jquery');

function User () { }

User.login = function (email, password){
    return Q.promise(function(resolve, reject){
        setTimeout(function(){
            resolve({msg:"ok"});
        }, 1000);
        /*$.post('/api/user/login', {
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
