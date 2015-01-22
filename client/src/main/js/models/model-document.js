'use strict';

var Q = require('q'),
	_ = require('lodash'),
	$ = require('jquery'),
	Endpoints = require("../constants/endpoints");

function Document() { }

Document.upload = function (applicationId, document) {
	var formData = new FormData();
	formData.append('file', document.file);
	delete document.file;
	formData.append('details', JSON.stringify(document));

	return Q.promise(function(resolve, reject) {
		$.ajax({
				url: Endpoints.APPLICATIONS.ONE.DOCUMENTS.URL.replace(':id', applicationId),
				type: 'POST',
				data: formData,
				contentType: false,
				mimeType: false,
				processData: false
			}).success(function(response) {
			console.log(response);
				resolve(response);
			}).error(function(error) {
			console.log(error);
				reject(error.responseJSON);
			});
	});
};

module.exports = Document;
