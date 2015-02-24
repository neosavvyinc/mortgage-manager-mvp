'use strict';

var async = require('async'),
	applicationService = require('../services/service-application'),
	s3Service = require('../services/service-s3'),
    settings = require('../config/app/settings');

exports.getAllApplications = function(req, res){
    var uid = req.params.uid;

    if( uid === req.user._id){
        applicationService.getUserApplications(uid, function(applications) {
            res.send(applications);
            res.end();
            settings.log.info('Get all applications success');
        }, function(error) {
            if(error) {
                settings.log.fatal(error.message);
                res.status(500).send({message: 'Internal Server Error'});
            }
            res.end();
        });
    } else {
        res.status(500).send({message: 'Internal Server Error'});
        res.end();
    }

};

/**
 * Route handler to create an application for a user.
 * @param req
 * @param res
 */
exports.createApplication = function(req, res){
    var uid = req.params.uid,
	    applicationId;

    if( uid === req.user._id) {
	    async.series([
			function(done) {
				applicationService.createApplication(uid, function(appId){
					applicationId = appId;
					done();
				}, function(error){
					done(error);
				});
			},
		    function(done) {
			    s3Service.createBucket(applicationId, done, done);
		    }
	    ], function(error) {
		    if(error){
			    settings.log.fatal(error);
			    res.status(500).send({message: 'Internal Server Error'});
		    } else {
			    res.send({message: 'success'}).end();
			    settings.log.info('Create applications success');
		    }
	    });

    } else {
        res.status(500).send({message: 'Internal Server Error'});
        res.end();
    }
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
        settings.log.info('Get documents for appId: '+ appId);
    }, function(error){
        if(error) {
            settings.log.fatal(error.message);
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
        settings.log.info('Get one document for appId '+appId + ' and docId '+ docId);
    }, function(error){
        if(error){
            settings.log.fatal(error.message);
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
        var url = documents[0].url;

        res.sendFile(url, null, function(err) {
            if(err) {
                if (err.code === 'ECONNABORT' && res.statusCode === 304) {
                    // No problem, 304 means client cache hit, so no data sent.
                    settings.log.warn('304 cache hit for ' + url);
                    return;
                }
                res.status(err.status).end();
            } else {
                res.status(200).end();
                settings.log.info('Successfully sending pdf with docId: '+ docId);
            }
        });
    }, function(error){
        if(error) {
            settings.log.fatal(error.message);
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
                settings.log.fatal(error);
                res.status(500).send({message: 'Internal Server Error'});
            } else {
                res.status(200).end();
                settings.log.info('Successfully downloading pdf with docId: '+ docId);
            }
        });
    }, function(error){
        if(error){
            settings.log.fatal(error.message);
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.getApplicationLenders = function(req, res){
    var appId = req.params.appId;

    applicationService.getLenders(appId, function(lenders){
        res.send(lenders);
        res.end();
        settings.log.info('Get application lenders for application: '+ appId);
    }, function(error){
        if(error) {
            settings.log.fatal(error.message);
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.getApplicationBorrowers = function(req, res){
    var appId = req.params.appId;

    applicationService.getBorrowers(appId, function(borrowers){
        res.send(borrowers);
        res.end();
        settings.log.info('Get application borrowers for application: '+ appId);
    }, function(error){
        if(error) {
            settings.log.fatal(error.message);
            res.status(500).send({message: 'Internal Server Error'});
        }
    });
};

exports.inviteLenderToApplication = function(req, res){
    var appId = req.params.appId,
        lenderInfo = req.body,
        userId = req.user._id;

    applicationService.inviteLender(appId, userId, lenderInfo, function(){
        res.send({message: 'Success'});
        res.end();
        settings.log.info('Lender invited by '+ userId + '. Application: ' + appId);
    }, function(error) {
        if(error) {
            settings.log.fatal(error.message);
            res.status(500).send(error.message);
        }
    });
};

exports.reSendLenderInvite = function(req, res){
    var inviteInfo = req.body,
        appId = req.params.appId;

    inviteInfo.senderId = req.user._id;

    applicationService.reSendLenderInvitation(appId, inviteInfo, function(){
        res.send({message: 'Success'});
        res.end();
        settings.log.info('Resending lender invite. Application: ' + appId);
    }, function(error) {
        if(error) {
            settings.log.fatal(error.message);
            res.status(500).send({message: 'There was an error sending the new invitation'});
        }
    });
};

exports.deleteInvite = function(req, res){
    var inviteInfo = req.body,
        appId = req.params.appId;

    inviteInfo.senderId = req.user._id;

    applicationService.deleteInvitation(appId, inviteInfo, function(){
        res.send({message: 'Success'});
        res.end();
        settings.log.info('Deleting lender invite. Application: ' + appId);
    }, function(error){
        if(error) {
            settings.log.fatal(error.message);
            res.status(500).send({message: 'There was an error deleting the invitation'});
        }
    });

};