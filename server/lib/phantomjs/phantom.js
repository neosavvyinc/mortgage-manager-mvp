'use strict';

var path = require('path'),
	async = require('async'),
	childProcess = require('child_process'),
	phantomjs = require('phantomjs'),
	utils = require('../utils/common-utils');

exports.convertToPdf = function(imageSourcePath, pdfTargetPath, captureOptions, success, failure) {
	var html,
		filePath;

	async.series([
		function(done) {
			html = _getImageHtml(imageSourcePath, captureOptions.height, captureOptions.width);
			done();
		},
		function(done) {
			var result = utils.writeTmpFileSync(html, 'html');
			filePath = result.path;
			done();
		},
		function(done) {
			_capturePdf(filePath, pdfTargetPath, captureOptions, done, done);
		},
		function(done) {
			utils.deleteFileSync(filePath);
			done();
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
 * Renders image and saves to pdf targetPath
 * @param htmlSourcePath {String} source of html to render
 * @param pdfTargetPath {String} target image path
 * @param captureOptions {Object}: width, height, captureDelay
 * @param success
 * @param failure
 */
var _capturePdf = function(htmlSourcePath, pdfTargetPath, captureOptions, success, failure) {
	var binPath=phantomjs.path,
		binArgs=[
			path.resolve('./lib/phantomjs/scripts/capture.js'),
			path.resolve(htmlSourcePath),
			path.resolve(pdfTargetPath)
		];

	// the arguments in capture.js are handled by position.  In order to makes
	// sure we get things in the proper place we make defaults where args are not explicit in captureOptions
	binArgs.push(utils.dereference(captureOptions, 'width', 600));
	binArgs.push(utils.dereference(captureOptions, 'height', 480));
	binArgs.push(utils.dereference(captureOptions, 'delay', 0));
	childProcess.execFile(binPath, binArgs, function(error, stdout, stderr) {
		if(stdout) {
			console.log('phantomjs.capturePdf: stdout=' + stdout);
		}
		if(error) {
			if(error.code === 1) {
				success();
			} else {
				failure(error);
			}
		} else {
			success();
		}
	});
};

/**
 * Private method that embeds the image in html and
 * @param imagePath
 * @param height
 * @param width
 */
var _getImageHtml = function(imagePath, height, width) {
	var html, context={};
	context.imageWidth = width;
	context.imageHeight = height;
	context.imageUrl = path.resolve(imagePath);
	html = utils.renderTemplate('./lib/phantomjs/templates/image-to-pdf.handlebars', context);
	return html;
};
