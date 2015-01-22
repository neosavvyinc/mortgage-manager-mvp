var Q = require('q');
var $ = require('jquery');

var Endpoints = require("../constants/endpoints");

function Application() { }

Application.getDocuments = function(appID){
    return Q.promise(function(resolve, reject){
        $.get(Endpoints.APPLICATIONS.ONE.DOCUMENTS.URL.replace(':id', appID))
            .success(function(response){
                resolve(response);
            })
            .error(function(error){
                reject(error);
            });
    })
};

module.exports = Application;
