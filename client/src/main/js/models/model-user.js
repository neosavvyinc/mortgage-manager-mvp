'use strict';

var Q = require('q');
var _ = require('lodash');
var $ = require('jquery');

var Endpoints = require('../constants/endpoints');

function User () { }

User.login = function (email, password){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.LOGIN.URL, {
            email: email,
            password: password
        }).success(function(response){
            resolve(response);
        }).error(function(error){
            reject(error);
        });
    });
};

User.getCurrentUser = function() {
	return Q.promise(function(resolve, reject) {
		$.get(Endpoints.USER.URL).success(function(response) {
			resolve(response);
		}).error(function(error) {
			reject(error);
		});
	});
};

User.logOut = function () {
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.LOGOUT.URL)
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.isAuthenticated = function () {
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.ISAUTHENTICATED.URL)
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.register = function (newUser){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.REGISTER.URL, newUser)
            .success(function(response){
                resolve(response);
            })
            .error(function(error) {
                reject(error);
            });
    });
};

User.update = function (userId, userInfo){
    if(userInfo.token) delete userInfo.token;
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.USER.ONE.URL.replace(':id', userId), userInfo)
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.getUserDetails = function(userID){
    return Q.promise(function(resolve, reject){
        $.get(Endpoints.USER.ONE.URL.replace(':id', userID))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.addCoapplicant = function (applicantID, coapplicantInfo){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.USER.ONE.COAPPLICANT.URL.replace(':id', applicantID), coapplicantInfo)
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.getApplications = function(userID){
    return Q.promise(function(resolve, reject){
        $.get(Endpoints.USER.ONE.APPLICATIONS.URL.replace(':id', userID))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.generateApplication = function(userID){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.USER.ONE.APPLICATIONS.URL.replace(':id', userID))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.emailExists = function(email){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.EMAIL.URL, {email: email})
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

User.addAppAndLogin = function(email, password, token, appId){
    return Q.promise(function(resolve, reject){
        $.post(Endpoints.LOGIN.WITHTOKEN.URL, {
            email: email,
            password: password,
            token: token,
            appId: appId
        }).success(function(response){
            resolve(response);
        }).error(function(error){
            reject(error);
        });

    });
};

User.forgotPassword = function(email) {
    return Q.promise(function(resolve, reject) {
        $.post(Endpoints.FORGOTPASSWORD.URL, {
            email: email
        }).success(function(response) {
            resolve(response);
        }).error(function(error) {
            reject(error);
        });
    });
};

User.updatePassword = function(uid, oldPassword, newPassword, token) {
	return Q.promise(function(resolve, reject) {
        $.post(Endpoints.USER.ONE.UPDATEPASSWORD.URL.replace(':id', uid), {
	        oldPassword: oldPassword,
            password: newPassword,
            token: token
        }).success(function(response) {
            resolve(response);
        }).error(function(error) {
            reject(error);
        });
    });
};

User.checkTrialExpired = function(uid) {
	return Q.promise(function(resolve, reject) {
		$.get(Endpoints.USER.ONE.TRIALEXPIRED.URL.replace(':id', uid))
		.success(function(response) {
			resolve(response);
		}).error(function(error) {
			reject(error.responseJSON);
		});
	});
};

User.checkS3Enabled = function() {
	return Q.promise(function(resolve, reject) {
		$.get(Endpoints.CHECKENABLEDS3.URL)
			.success(function(response) {
				resolve(response);
			}).error(function(error) {
				reject(error.responseJSON);
			});
	});
};

module.exports = User;
