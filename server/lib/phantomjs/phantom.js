'use strict';

var fs = require('fs'),
	os = require('os'),
	path = require('path'),
	util = require('util'),
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
			var result = _writeTmpFileSync(html, 'html');
			filePath = result.path;
			done();
		},
		function(done) {
			console.log('done3');
			_capturePdf(filePath, pdfTargetPath, captureOptions, done, done);
		},
		function(done) {
			console.log('done4');
			//_deleteFileSync(filePath);
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
	console.log(htmlSourcePath);
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

/**
 * Works with 'os' to find temporary directory and finds a unique filename within. The reason
 * it is private is because the filename is not guaranteed to remain unique until it physically
 * exists in the filesystem. We leave it to local brains to make sure the path is used immediately
 * @private
 */
function _getTmpFilePath(prefix, extension) {
	var index, _path;
	for(index=0; true; index++) {
		_path = path.join(os.tmpdir(), util.format("%s-%d.%s", prefix, index, extension));
		if(fs.existsSync(_path) === false) {
			break;
		}
	}
	return _path;
}

/**
 * Creates a temporary file and writes data to it using fs.writeFileSync
 * @param data
 * @param {String} extension - file extension
 * @param {Object} options (optional)
 * @returns {{path: {String}, error:{Error}}}
 */
var _writeTmpFileSync=function(data, extension, options) {
	var tmpPath=_getTmpFilePath('MAM', extension),
		result = {};
	try {
		fs.writeFileSync(tmpPath, data, options);
		result.path = tmpPath;
	} catch(error) {
		console.error("file.writeFileSync: attempt to write '%s' failed: %s", path, error);
		result.error = error;
	}
	return result;
};


var _deleteFileSync=function(path) {
	try {
		fs.unlinkSync(path);
	} catch(error) {
		log.error("file.delete: attempt to delete '%s' failed: %s", path, error);
	}
};