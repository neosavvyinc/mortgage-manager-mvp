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
			    if(settings.getConfig().s3.s3Toggle) {
				    s3Service.createBucket(applicationId, done, done);
			    } else {
				    done();
			    }
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
	    if(settings.getConfig().s3.s3Toggle) {
		    _generateSignedUrl(appId, docId, function(url) {
			    settings.log.info('Sending signed url for viewing file ' +url);
			    res.send(url);
		    }, function(error) {
			    settings.log.fatal(error);
			    res.status(500).send({message: 'Internal Server Error'});
		    });
	    } else {
		    res.sendFile(url, null, function (err) {
			    if (err) {
				    if (err.code === 'ECONNABORT' && res.statusCode === 304) {
					    // No problem, 304 means client cache hit, so no data sent.
					    settings.log.warn('304 cache hit for ' + url);
					    return;
				    }
				    res.status(err.status).end();
			    } else {
				    res.status(200).end();
				    settings.log.info('Successfully sending pdf with docId: ' + docId);
			    }
		    });
	    }
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

		if(settings.getConfig().s3.s3Toggle) {
			_generateSignedUrl(appId, docId, function(url) {
				settings.log.info('Sending signed url for downloading file '+url);
				res.redirect(url);
			}, function(error) {
				settings.log.fatal(error);
				res.status(500).send({message: 'Internal Server Error'});
			});
		} else {
			res.download(url, documents[0].name + '.pdf', function (error) {
				if (error) {
					settings.log.fatal(error);
					res.status(500).send({message: 'Internal Server Error'});
				} else {
					res.status(200).end();
					settings.log.info('Successfully downloading pdf with docId: ' + docId);
				}
			});
		}
	}, function(error){
		if(error){
			settings.log.fatal(error.message);
			res.status(500).send({message: 'Internal Server Error'});
		}
	});
};

/**
 * Route handler to get all lenders for an application
 * @param req
 * @param res
 */
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

/**
 * Route handler to get all borrowers for an application
 * @param req
 * @param res
 */
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

/**
 * Route handler to invite a lender
 * @param req
 * @param res
 */
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

/**
 * Route handler to remind a lender of an invitation
 * @param req
 * @param res
 */
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

/**
 * Route handler to delete a lender invite
 * @param req
 * @param res
 */
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

/**
 * Generate signed policy for S3 downloads
 * @param appId
 * @param docId
 * @param success
 * @param failure
 * @private
 */
var _generateSignedUrl = function(appId, docId, success, failure) {
	s3Service.generateSignedUrl(appId, docId, success, failure);
};