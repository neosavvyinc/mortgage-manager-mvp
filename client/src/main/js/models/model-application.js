var Q = require('q');
var $ = require('jquery');

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

module.exports = Application;
