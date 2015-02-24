'use strict';

var fs = require('fs'),
	async = require('async'),
	_ = require('underscore'),
	mkdirp = require('mkdirp'),
	policy = require('s3-policy'),
	AWS = require('aws-sdk'),
	settings = require('../config/app/settings'),
	applicationService = require('./service-application');

/**
 * Generates policy signatures for download and view
 * @param appId
 * @returns {Object}
 */
exports.generatePolicies = function(appId) {
	var s3Config = settings.getConfig().s3;

	return policy({
		secret: s3Config.secretAccessKey,
		length: 5000000,
		bucket: appId,
		key: s3Config.accessKeyId,
		expires: new Date(Date.now() + 60000),
		acl: 'private'
	});
};

exports.postFile = function(s3Client, uploadPath, appId, docId, success, failure){
	console.log('Document Id" '+docId);

	var uploader = s3Client.uploadFile({
		localFile: uploadPath,
		s3Params: {
			Bucket: appId,
			Key: docId
		}
	});

	uploader.on('error', function(err) {
		settings.log.fatal(err);
		failure(new Error('Unable to upload', err.stack));
	});

	uploader.on('end', function(data) {
		if(data){
			success();
		} else{
			failure(new Error('Unable to upload file'));
		}
	});
};

var deleteS3Files = function(s3Client, appId, docIds, success, failure){
	var deleteDocs = [];

	_.each(docIds, function(docId){
		deleteDocs.push({
			Key: docId
		});
	});

	var deleter = s3Client.deleteObjects({
		Bucket: appId,
		Delete: {
			Objects: deleteDocs
		}
	});

	deleter.on('error', function(err) {
		failure(new Error('Unable to delete', err.stack));
	});

	deleter.on('end', function(data) {
		if(data){
			success();
		} else{
			failure(new Error('Unable to upload file'));
		}
	});
};

exports.deleteFiles = function(s3Client, appId, docIds, success, failure){
	deleteS3Files(s3Client, appId, docIds, success, failure);
};

exports.createBucket = function(appId, success, failure){
	var s3Connection = new AWS.S3({
		params: {
			Bucket: appId
		}
	});

	s3Connection.createBucket(function(err) {
		if(err){
			failure(new Error('There was a problem creating the application bucket'));
		} else {
			success();
		}
	});
};

exports.deleteBucket = function(s3Client, appId, success, failure){

	var s3Connection = new AWS.S3({
		params: {
			Bucket: appId
		}
	});

	var documentIds = [];

	async.series([
		function(done){
			applicationService.getDocuments(appId, function(documents){
				_.each(documents, function(document){
					if(document.uploadDate){
						documentIds.push(document._id);
					}
				});
				done();
			}, done);
		},
		function(done){
			deleteS3Files(s3Client, appId, documentIds, done, done);
		},
		function(done) {
			s3Connection.deleteBucket(function (err) {
				if (err) {
					done(new Error('There was a problem deleting the application bucket'));
				} else {
					done();
				}
			});
		}
	], function(error){
		if(error){
			failure(error);
		} else {
			success();
		}
	});

};