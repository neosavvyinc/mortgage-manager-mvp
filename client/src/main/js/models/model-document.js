'use strict';

var Q = require('q'),
	_ = require('lodash'),
	$ = require('jquery'),
	Endpoints = require('../constants/endpoints');

function Document() { }

/**
 * Makes a call to the api end point that uploads a file
 * @param applicationId
 * @param document
 * @returns {promise}
 */
Document.upload = function (applicationId, document) {
	var formData = new FormData(),
		url;
	formData.append('file', document.file);
	delete document.file;

	formData.append('details', JSON.stringify(document));

	if(document._id !== undefined) {
		url = Endpoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', applicationId).replace(':docId', 'new');
	} else {
		url = Endpoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', applicationId).replace(':docId', document._id);
	}

	return Q.promise(function(resolve, reject) {
		$.ajax({
				url: url,
				type: 'POST',
				data: formData,
				contentType: false,
				mimeType: false,
				processData: false
			}).success(function(response) {
				resolve(response);
			}).error(function(error) {
				reject(error.responseJSON);
			});
	});
};

/**
 * Creates a document entry(does not upload) in mongo
 * @param applicationId
 * @param documentDetails
 * @returns {promise}
 */
Document.create = function(applicationId, documentDetails) {
	return Q.promise(function(resolve, reject) {
		$.post(Endpoints.APPLICATIONS.ONE.DOCUMENTENTRY.URL.replace(':id', applicationId), documentDetails)
			.success(function(response){
				resolve(response);
			})
			.error(function(error){
				reject(error);
			});
	});
};

/**
 * Get S3 url for viewing files
 * @param applicationId
 * @param documentId
 * @returns {*}
 */
Document.getS3Url = function(applicationId, documentId) {
	return Q.promise(function(resolve, reject) {
		$.get(Endpoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', applicationId).replace(':docId', documentId))
			.success(function(response) {
				resolve(response);
			})
			.error(function(error) {
				reject(error);
			});
	});
};

module.exports = Document;
