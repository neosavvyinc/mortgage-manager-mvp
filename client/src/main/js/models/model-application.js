var Q = require('q');
var $ = require('jquery');
var _ = require('lodash');

var Endpoints = require("../constants/endpoints");

function Application() { }

Application.getDocuments = function(appId){
    return Q.promise(function(resolve, reject){
        $.get(Endpoints.APPLICATIONS.ONE.DOCUMENTS.URL.replace(':id', appId))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    })
};

Application.getDocument = function(appId, docId) {
    return Q.promise(function(resolve, reject) {
        $.get(Endpoints.APPLICATIONS.ONE.DOCUMENTS.ONE.URL.replace(':id', appId).replace(':docId', docId))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

Application.getLenders = function(appId){
    return Q.promise(function(resolve, reject) {
        $.get(Endpoints.APPLICATIONS.ONE.LENDERS.URL.replace(':id', appId))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

Application.getBorrowers = function(appId){
    return Q.promise(function(resolve, reject) {
        $.get(Endpoints.APPLICATIONS.ONE.BORROWERS.URL.replace(':id', appId))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    });
};

Application.lenderInvite = function(appId, lenderInfo){
    return Q.promise(function(resolve, reject) {
        $.post(Endpoints.APPLICATIONS.ONE.LENDERS.URL.replace(':id', appId), lenderInfo)
            .success(function(response){
                resolve(response);
            }).error(function(error){
                reject(error);
            }
        );
    });
};

Application.reSendInvite = function(appId, inviteInfo){
    return Q.promise(function(resolve, reject) {
        $.post(Endpoints.APPLICATIONS.ONE.LENDERS.REINVITE.URL.replace(':id', appId), inviteInfo)
            .success(function(response){
                resolve(response);
            }).error(function(error){
                reject(error);
            }
        );
    });
};

module.exports = Application;
