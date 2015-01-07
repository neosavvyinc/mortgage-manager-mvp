var Q = require('q');
var _ = require('lodash');

var _sessions = { };

// log in, add session
//{ email: 'ccaplinger@neosavvy.com', password: 'p@ssword!' }

function User () { }

User.isAuthenticated = function (user) {
    return new Q.Promise(function (resolve, reject) {
        if (_sessions[123]) {
            resolve({ id: 1, name: 'Chris Caplinger' });
        } else {
            reject('No active session');
        }
    });
};

User.login = function (username, password) {
    _sessions[123] = { 
        id: 1, 
        email: 'ccaplinger@neosavvy.com',
        name: 'Chris Caplinger'
    };

    return new Q.Promise(function (resolve) {
        setTimeout(function () {
            resolve(_sessions[123]);
        }, 800);
    });
};

module.exports = User;
