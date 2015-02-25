'use strict';

var async = require('async'),
	_ = require('underscore'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	AWS = require('aws-sdk'),
	settings = require('../config/app/settings'),
	applicationService = require('./service-application'),
	documentModel = require('../db/models/model-document').Model;

/**
 * Generates signed urls for download and view
 * @param appId
 * @param docId
 * @param success
 * @param failure
 */
exports.generateSignedUrl = function(appId, docId, success, failure) {
	var s3 = new AWS.S3(),
		document = new documentModel(),
		params = {
			Bucket: appId
		};

	async.series([
		function(done) {
			document.retrieve({_id: docId}, function(docs) {
				if(docs.length > 0) {
					params.Key = docs[0].url.split('/')[1];
					done();
				} else {
					done(new Error('Document does not exist'));
				}
			}, done);
		},
		function(done) {
			s3.getSignedUrl('getObject', params, function(err, url) {
				if(err) {
					settings.log.warn(err);
				} else {
					done(url);
				}
			});
		}
	], function(completed) {
		if(completed instanceof Error) {
			failure(completed);
		} else {
			success(completed);
		}
	});
};

/**
 * Creates S3 buckets
 * @param appId
 * @param success
 * @param failure
 */
exports.createBucket = function(appId, success, failure){
	var s3Connection = new AWS.S3({
		params: {
			Bucket: appId
		}
	});

	var corsParams = {
		Bucket: appId,
		CORSConfiguration: {
			CORSRules: [
				{
					AllowedHeaders: [
						'*'
					],
					AllowedMethods: [
						'GET',
						'PUT',
						'POST'
					],
					AllowedOrigins: [
						'*'
					],
					ExposeHeaders: [
						'Accept-Ranges',
						'Content-Encoding',
						'Content-Length',
						'Content-Range'
					],
					MaxAgeSeconds: 300
				}
			]
		}
	};

	async.series([
		function(done) {
			s3Connection.createBucket(function(err) {
				if(err){
					done(new Error('There was a problem creating the application bucket'));
				} else {
					done();
				}
			});
		},
		function(done) {
			s3Connection.putBucketCors(corsParams, function(err, data) {
				if(err) {
					done(err+'\n'+err.stack);
				} else {
					settings.log.info(data);
					done();
				}
			});
		}
	], function(error) {
		if(error) {
			failure(error);
		} else {
			success();
		}
	});
};

/**
 * Get a file from S3
 * @param s3Client
 * @param appId
 * @param docId
 * @param success
 * @param failure
 */
exports.getFile = function(s3Client, appId, docId, success, failure){
	var	downloadPath = __dirname.split('lib')[0] + 'uploads/' + appId + '/' + docId;

	if(!fs.existsSync(downloadPath.split(docId)[0])){
		mkdirp(downloadPath.split(docId)[0]);
	}

	var downloader = s3Client.downloadFile({
		localFile: downloadPath,
		s3Params: {
			Bucket: appId,
			Key: docId
		}
	});

	downloader.on('error', function(err) {
		failure(new Error('Unable to download', err.stack));
	});

	downloader.on('end', function() {
		success();
	});
};

/**
 * Send a file to S3 for storage
 * @param s3Client
 * @param name
 * @param uploadPath
 * @param appId
 * @param docId
 * @param success
 * @param failure
 */
exports.postFile = function(s3Client, name, uploadPath, appId, docId, success, failure){
	var uploader = s3Client.uploadFile({
		localFile: uploadPath,
		s3Params: {
			Bucket: appId,
			Key: docId,
			ContentDisposition: 'attachment; filename='+ name
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

/**
 * This may be used later to delete files from S3
 * @param s3Client
 * @param appId
 * @param docIds
 * @param success
 * @param failure
 */
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

	deleter.on('end', function(error) {
		if(error) {
			failure(new Error('Unable to delete file' + error));
		} else {
			success();
		}
	});
};

exports.deleteFiles = function(s3Client, appId, docIds, success, failure){
	deleteS3Files(s3Client, appId, docIds, success, failure);
};

/**
 * Delete a bucket when an application is deleted.
 * @param s3Client
 * @param appId
 * @param success
 * @param failure
 */
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