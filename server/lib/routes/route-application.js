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

/**
 * Route handler that returns the file url for a given docId and appId
 * @param req
 * @param res
 */
exports.getFile = function(req, res){
    var appId = req.params.appId,
        docId = req.params.docId;

    applicationService.getDocuments(appId, docId, function(documents) {
        var url = documents[0].url,
            options = {
                root: __dirname.split('lib')[0]
            };

        res.sendFile(url, options, function(err) {
            if(err) {
                if (err.code === 'ECONNABORT' && res.statusCode === 304) {
                    // No problem, 304 means client cache hit, so no data sent.
                    console.log('304 cache hit for ' + url);
                    return;
                }
                res.status(err.status).end();
            } else {
                res.status(200).end();
            }
        });
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

/**
 * Route handler that returns the file url for a given docId and appId
 * @param req
 * @param res
 */
exports.downloadFile = function(req, res){
    var appId = req.params.appId,
        docId = req.params.docId;

    applicationService.getDocuments(appId, docId, function(documents) {
        var url = documents[0].url;

        res.download(url, documents[0].name+'.pdf', function(error) {
            if(error) {
                console.log(error);
                res.status(500).send({message: 'Internal Server Error'});
            } else {
                res.status(200).end();
            }
        });
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.getApplicationLenders = function(req, res){
    var appId = req.params.appId;

    applicationService.getLenders(appId, function(lenders){
        res.send(lenders);
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.getApplicationBorrowers = function(req, res){
    var appId = req.params.appId;

    applicationService.getBorrowers(appId, function(borrowers){
        res.send(borrowers);
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.inviteLenderToApplication = function(req, res){
    var appId = req.params.appId,
        lenderInfo = req.body,
        userId = lenderInfo.borrowerId;

    delete lenderInfo.borrowerId;

    applicationService.inviteLender(appId, userId, lenderInfo, function(){
        res.send({message: 'Success'});
        res.end();
    }, function(error){
        if(error){
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};