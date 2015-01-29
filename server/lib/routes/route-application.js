'use strict';

var applicationService = require('../services/service-application');

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

/**
 * Route handler that gets all documents for an application
 * @param req
 * @param res
 */
exports.getApplicationDocuments = function(req, res){
    var appId = req.params.appId;

    applicationService.getDocuments(appId, null, function(documents) {
        res.send(documents);
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

/**
 * Route handler that gets a document with specified docId for an application
 * @param req
 * @param res
 */
exports.getApplicationDocument = function(req, res){
    var appId = req.params.appId,
        docId = req.params.docId;

    applicationService.getDocuments(appId, docId, function(documents) {
        res.send(documents);
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};