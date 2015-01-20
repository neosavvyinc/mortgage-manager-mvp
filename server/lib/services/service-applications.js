'use strict';

var async = require('async');
var applicationModel = require('../db/models/model-application').Model;
var userDetailsModel = require('../db/models/model-user-details').Model;
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

    var applicantDetails,
        coapplicantDetails = null,
        documents;

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
                }, function (error) {
                    callback(error);
                });
            } else {
                done();
            }
        },
        function(done){
            documents = documentService.generateDocumentList(applicantDetails, coapplicantDetails);
            application.insertNewApp(applicantDetails, coapplicantDetails, documents, done, done);
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
