'use strict';

var applicationService = require('../services/service-applications');

exports.getAllApplications = function(req, res){
    var uid = req.params.uid;

    applicationService.getUserApplications(uid, function(applications) {
        res.send(applications);
        res.end();
    }, function(error) {
        if(error) {
            res.status(500).send({message: 'Internal Server Error'});
        }
        res.end();
    });
};

exports.createApplication = function(req, res){
    var uid = req.params.uid;

    applicationService.createApplication(uid, function(){
        res.send({message: 'success'});
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.getApplicationDocuments = function(req, res){
    var appId = req.params.appId;
    applicationService.getDocuments(appId,  function(documents) {
        res.send(documents);
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};