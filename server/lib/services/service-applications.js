'use strict';

var async = require('async');
var _ = require('underscore');
var applicationModel = require('../db/models/model-application').Model;
var userDetailsModel = require('../db/models/model-user-details').Model;
var documentModel = require('../db/models/model-document').Model;
var applicationService = require('../services/service-applications');
var documentService = require('./service-documents');

exports.getUserApplications = function(uid, callback){
    var application = new applicationModel();
    application.retrieve({pUID: uid}, function(apps){
        callback(apps);
    }, function(error){
        callback(null, error);
    });
};

exports.createApplication = function(uid, callback) {

    var userDetails = new userDetailsModel();
    var application = new applicationModel();
    var documents = new documentModel();

    var applicantDetails,
        coapplicantDetails = null,
        docs,
        applicationId;

    async.series([
        function(done){
            userDetails.retrieve({_id: uid}, function(bDetails){
                applicantDetails = bDetails[0];
                done();
            }, function(error){
                callback(error);
            });
        },
        function(done){
            if(applicantDetails.coUID){
                userDetails.retrieve({_id: applicantDetails.coUID}, function (coAppDetails) {
                    coapplicantDetails = coAppDetails[0];
                    done();
                }, done);
            } else {
                done();
            }
        },
        function(done) {
            application.insertNewApp(applicantDetails, coapplicantDetails, function(appUUID){
                applicationId = appUUID;
                done();
            }, done);
        },
        function(done) {
            docs = documentService.generateDocumentList(applicationId, applicantDetails, coapplicantDetails);
            console.log("generating documents");
            documents.insertNewDocument(docs, done, done);
            console.log("documents Inserted");
        },
        function(done){
            console.log("insertind UUIDS into app");
            applicationService.insertDocuments(docs, done, done);
            console.log("Done");
        }
    ], function(error){
            if(error !== undefined){
                callback(error);
            } else {
                callback(null, null);
            }
        }
    );
};

exports.insertDocuments = function(documents, callback){
    var application = new applicationModel();

    if(!documents[0] || documents[0].appId){
        callback(new Error('The document array was empty'));
    }
    application.update({documents: _.pluck(documents, '_id')}, {_id: documents[0].appId}, callback, callback);
};

exports.getDocuments = function(appId, success, failure){
    console.log(new documentModel());
    var documents = new documentModel();

    documents.retrieve({appId: appId}, success, failure);
};