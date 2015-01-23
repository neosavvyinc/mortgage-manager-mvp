'use strict';

var Q = require('q'),
	_ = require('lodash'),
	$ = require('jquery'),
	Endpoints = require("../constants/endpoints");

function Document() { }

Document.upload = function (applicationId, document) {
	var formData = new FormData(),
		url;
	formData.append('file', document.file);
	delete document.file;
	formData.append('details', JSON.stringify(document));

	if(document._id !== undefined) {
		url = Endpoints.APPLICATIONS.ONE.DOCUMENTS.URL.replace(':id', applicationId);
	} else {
		url = Endpoints.APPLICATIONS.ONE.DOCUMENTS.ONE.URL.replace(':id', applicationId).replace(':docId', document._id);
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
			console.log(error);
				reject(error.responseJSON);
			});
	});
};

module.exports = Document;
