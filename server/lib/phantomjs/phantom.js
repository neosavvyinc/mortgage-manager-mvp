'use strict';

var path = require('path'),
	async = require('async'),
	childProcess = require('child_process'),
    settings = require('../config/app/settings'),
	utils = require('../utils/common-utils');

exports.convertToPdf = function(imageSourcePath, pdfTargetPath, captureOptions, success, failure) {
	var html,
		filePath;

	async.series([
		function(done) {
            settings.log.info('Generating some HTML');
			html = _getImageHtml(imageSourcePath, captureOptions.height, captureOptions.width);
			done();
		},
		function(done) {
            settings.log.info('Writing out the html file with generated html');
			var result = utils.writeTmpFileSync(html, 'html');
			filePath = result.path;
			done();
		},
		function(done) {
            settings.log.info('About to capture the pdf file');
			_capturePdf(filePath, pdfTargetPath, captureOptions, done, done);
		},
		function(done) {
            settings.log.info('Deleting the file');
			utils.deleteFileSync(filePath, done, done);
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
	var binArgs=[
			path.resolve(__dirname, './scripts/capture.js'),
			path.resolve(htmlSourcePath),
			path.resolve(pdfTargetPath)
		], command = 'phantomjs';

	// the arguments in capture.js are handled by position.  In order to makes
	// sure we get things in the proper place we make defaults where args are not explicit in captureOptions
	binArgs.push(utils.dereference(captureOptions, 'width', 600));
	binArgs.push(utils.dereference(captureOptions, 'height', 480));
	binArgs.push(utils.dereference(captureOptions, 'delay', 0));

    for (var i=0; i<binArgs.length; i++){
        command += ' ' + binArgs[i];
    }

	childProcess.exec(command, function(error, stdout, stderr) {
		if(stdout) {
            settings.log.info('phantomjs.capturePdf: stdout=' + stdout);
		}
		if(error) {
			if(error.code === 1) {
				success();
			} else {
                settings.log.error('Error while running phantom: ' + error);
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
	html = utils.renderTemplate(path.resolve(__dirname, './templates/image-to-pdf.handlebars'), context);
	return html;
};
