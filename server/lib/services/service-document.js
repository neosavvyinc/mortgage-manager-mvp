'use strict';

var path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	async = require('async'),
	archiver = require('archiver'),
	commonUtils = require('../../lib/utils/common-utils'),
	documentModel = require('../db/models/model-document').Model,
	applicationModel = require('../db/models/model-application').Model,
	settings = require('../config/app/settings');

/**
 * Service that inserts a document entry when requested by lender into mongo
 * @param doc
 * @param success
 * @param failure
 */
exports.createDocument = function(doc, success, failure) {
	var currentDate = new Date(),
		docId = commonUtils.generateId(),
		document = new documentModel();

	_.extend(doc, {
		requestDate: currentDate,
		_id: docId
	});
	document.insert(doc, success, failure);
};

/**
 * Retrieves one document given a document ID
 * @param docId
 * @param success
 * @param failure
 */
exports.getOneDocument = function(docId, success, failure){
	var document = new documentModel();
	document.retrieve({_id:docId}, function(docData){
		if(docData.length){
			success(docData[0].toObject());
		} else {
			failure(new Error('Error retrieving document'));
		}
	}, failure);
};

/**
 * Service that handles storing a document in mongo for a particular application
 * @param doc
 * @param success
 * @param failure
 */
exports.saveDocument = function(doc, success, failure) {
	var currentDate = new Date(),
		docId = doc._id;

	async.series([
		function(done) {
			//Check if document already exists and remove the file from server before re-upload
			if(docId !== undefined) {
				var document = new documentModel();
				document.retrieve({_id: docId}, function(docs) {
					//After removing the file update upload date. If file does not exists, set the request date.
					if(docs[0].url !== undefined) {
						var filePath = path.resolve(docs[0].url);
						if(!settings.getConfig().s3.s3Toggle) {
							commonUtils.deleteFileSync(filePath, function () {
								settings.log.info('Successfully deleted old file');
							}, function (error) {
								settings.log.error(error);
							});
						}
						_.extend(doc, {
							uploadDate: currentDate
						});
					} else {
						_.extend(doc, {
							uploadDate: currentDate,
							requestDate: currentDate,
							amount: 1
						});
					}
					done();
				}, done);
			} else {
				_.extend(doc, {
					_id: commonUtils.generateId(),
					uploadDate: currentDate,
					requestDate: currentDate,
					amount: 1
				});
				done();
			}
		},
		function(done) {
			//Store the document in mongo
			var document = new documentModel();
			document.insertOrUpdate(doc, done, done);
		},
		function(done) {
			//Add the document to doc array in application collection
			var application = new applicationModel();
			application.updateApplication(doc.appId, {documents: [doc._id]}, done, done);
		}
	], function(error) {
		if(error !== undefined) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Creates a zip file for all documents in an application
 * @param appId
 * @param success
 * @param failure
 */
exports.createDocumentZip = function(appId, success, failure) {
	var zipArchive = archiver.create('zip'),
		uploadPath = __dirname.split('lib')[0] + 'uploads/MortgageDocuments.zip',
		output = fs.createWriteStream(uploadPath),
		document = new documentModel(),
		documentArray = [];

	async.series([
		function(done) {
			document.retrieve({appId: appId}, function(docs) {
				documentArray = docs;
				done();
			}, function(error) {
				done(new Error(error));
			});
		},
		function(done) {
			output.on('close', function() {
				done(uploadPath);
			});

			zipArchive.on('error', function(err) {
				done(new Error(err));
			});

			zipArchive.pipe(output);

			_.each(documentArray, function(doc) {
				if(doc.url !== undefined) {
					doc = doc.toObject();
					zipArchive.file(doc.url, {name: doc.name + '.pdf'});
				}
			});

			zipArchive.finalize();
		}
	], function(completed) {
		if(completed instanceof Error) {
			failure(completed);
		} else {
			//Completed will be the upload path
			success(completed);
		}
	});
};

/**
 * Deletes the zip file after download is complete
 * @param zipUrl
 * @param success
 * @param failure
 */
exports.deleteZip = function(zipUrl, success, failure) {
	commonUtils.deleteFileSync(zipUrl, success, failure);
};

/**
 * Generates a new list of documents depending on the applicants
 * @param applicationId
 * @param applicantDetails
 * @param coapplicantDetails
 */
exports.generateDocumentList = function(applicationId, applicantDetails, coapplicantDetails){

	var documents = [],
        currentDate = new Date();
    
	//W2 - applicant
	documents.push({
		appId: applicationId,
		name: applicantDetails.firstName + ' ' + applicantDetails.lastName + '\'s ' + 'W2\'s',
		description: 'W2 for the past two years',
		type: 'Tax Document',
		amount: 2,
        requestDate: currentDate
	});

	// W2 - coapplicant
	if(coapplicantDetails){
		documents.push({
			appId: applicationId,
			name: coapplicantDetails.firstName + ' ' + coapplicantDetails.lastName + '\'s ' + 'W2\'s',
			description: 'W2 for the past two years',
			type: 'Tax Document',
			amount: 2,
            requestDate: currentDate
        });
	}

	// Paystubs - applicant
	documents.push({
		appId: applicationId,
		name: applicantDetails.firstName + ' ' + applicantDetails.lastName + '\'s ' + 'Paystubs',
		description: 'Two recent paystubs for sources of income',
		type: 'Income Document',
		amount: 2,
        requestDate: currentDate
    });

	// Paystubs - coapplicant
	if(coapplicantDetails){
		documents.push({
			appId: applicationId,
			name: coapplicantDetails.firstName + ' ' + coapplicantDetails.lastName + '\'s ' + 'Paystubs',
			description: 'Two recent paystubs for sources of income',
			type: 'Income Document',
			amount: 2,
            requestDate: currentDate
        });
	}

	// Renting
	if(applicantDetails.renting){
		documents.push({
			appId: applicationId,
			name: 'Cancelled checks',
			description: '12 cancelled checks to prove payment is made on time',
			type: 'Income Document',
			amount: 12,
            requestDate: currentDate
        });
	}

	// Marriage
	if(applicantDetails.marriedRecently){
		documents.push({
			appId: applicationId,
			name: 'Copy of marriage certificate',
			description: 'Copy of the marriage certificate',
			type: 'Identity Document',
			amount: 1,
            requestDate: currentDate
        });
	}

	// Self employment documents
	if(applicantDetails.isSelfEmployed){
		documents.push({
			appId: applicationId,
			name: 'Income Statement of Business',
			description: 'Copy of the Income statement for the business for the past two years',
			type: 'Income Document',
			amount: 2,
            requestDate: currentDate
        }, {
			appId: applicationId,
			name: 'Balance Statement',
			description: 'Copy of the Balance Statement for the business for the past two years',
			type: 'Income Document',
			amount: 2,
            requestDate: currentDate
        }, {
			appId: applicationId,
			name: 'Corporate Tax Return',
			description: 'copy of the last years and current Corporate Tax Return',
			type: 'Tax Document',
			amount: 2,
            requestDate: currentDate
        });
	}

	// Financial Assets
	if(applicantDetails.financialAssets){
		documents.push({
			appId: applicationId,
			name: 'SEP-IRA / 401k',
			description: 'Two recent statements from the account or institution',
			type: 'Income Document',
			amount: 1,
            requestDate: currentDate
        });
	}

	// OfferLetter
	documents.push({
		appId: applicationId,
		name: 'Offer Letter',
		description: 'A copy of the offer letter of the condo or property you are buying',
		type: 'Identity Document',
		amount: 1,
        requestDate: currentDate
    });

	return documents;
};
