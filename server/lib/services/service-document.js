'use strict';

var _ = require('underscore'),
	async = require('async'),
	commonUtils = require('../../lib/utils/common-utils'),
	documentModel = require('../db/models/model-document').Model,
	applicationModel = require('../db/models/model-application').Model;

/**
 * Service that handles storing a document in mongo for a particular application
 * @param doc
 * @param success
 * @param failure
 */
exports.saveDocument = function(doc, success, failure) {
	var currentDate = new Date();

	async.series([
		function(done) {
			//Store the document in mongo
			var document = new documentModel();
			if(doc._id === undefined) {
				doc._id = commonUtils.generateId();
			}
			_.extend(doc, {
				requestDate: currentDate,
				uploadDate: currentDate,
				amount: 1
			});
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
 * Generates a new list of documents depending on the applicants
 * @param applicationId
 * @param applicantDetails
 * @param coapplicantDetails
 */
exports.generateDocumentList = function(applicationId, applicantDetails, coapplicantDetails){

	var documents = [];

	//W2 - applicant
	documents.push({
		appId: applicationId,
		name: applicantDetails.firstName + ' ' + applicantDetails.lastName + '\'s ' + 'W2\'s',
		description: 'W2 for the past two years',
		type: 'Tax Document',
		amount: 2
	});

	// W2 - coapplicant
	if(coapplicantDetails){
		documents.push({
			appId: applicationId,
			name: coapplicantDetails.firstName + ' ' + coapplicantDetails.lastName + '\'s ' + 'W2\'s',
			description: 'W2 for the past two years',
			type: 'Tax Document',
			amount: 2
		});
	}

	// Paystubs - applicant
	documents.push({
		appId: applicationId,
		name: applicantDetails.firstName + ' ' + applicantDetails.lastName + '\'s ' + 'Paystubs',
		description: 'Two recent paystubs for sources of income',
		type: 'Income Document',
		amount: 2
	});

	// Paystubs - coapplicant
	if(coapplicantDetails){
		documents.push({
			appId: applicationId,
			name: coapplicantDetails.firstName + ' ' + coapplicantDetails.lastName + '\'s ' + 'Paystubs',
			description: 'Two recent paystubs for sources of income',
			type: 'Income Document',
			amount: 2
		});
	}

	// Renting
	if(applicantDetails.renting){
		documents.push({
			appId: applicationId,
			name: 'Cancelled checks',
			description: '12 cancelled checks to prove payment is made on time',
			type: 'Income Document',
			amount: 12
		});
	}

	// Marriage
	if(applicantDetails.marriedRecently){
		documents.push({
			appId: applicationId,
			name: 'Copy of marriage certificate',
			description: 'Copy of the marriage certificate',
			type: 'Identity Document',
			amount: 1
		});
	}

	// Self employment documents
	if(applicantDetails.isSelfEmployed){
		documents.push({
			appId: applicationId,
			name: 'Income Statement of Business',
			description: 'Copy of the Income statement for the business for the past two years',
			type: 'Income Document',
			amount: 2
		}, {
			appId: applicationId,
			name: 'Balance Statement',
			description: 'Copy of the Balance Statement for the business for the past two years',
			type: 'Income Document',
			amount: 2
		}, {
			appId: applicationId,
			name: 'Corporate Tax Return',
			description: 'copy of the last years and current Corporate Tax Return',
			type: 'Tax Document',
			amount: 2
		});
	}

	// Financial Assets
	if(applicantDetails.financialAssets){
		documents.push({
			appId: applicationId,
			name: 'SEP-IRA / 401k',
			description: 'Two recent statements from the account or institution',
			type: 'Income Document',
			amount: 1
		});
	}

	// OfferLetter
	documents.push({
		appId: applicationId,
		name: 'Offer Letter',
		description: 'A copy of the offer letter of the condo or property you are buying',
		type: 'Identity Document',
		amount: 1
	});

	return documents;
};