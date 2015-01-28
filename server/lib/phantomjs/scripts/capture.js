'use strict';

var system = require('system');
var webpage = require('webpage');

if(system.args.length < 3) {
	console.error('usage: phantomjs capture.js <sourceURL> <targetURL> [width] [height] [captureDelay]');
	phantom.exit(1);
} else {
	var sourcePath = system.args[1],
		targetPath = system.args[2],
		delay = (system.args.length > 5)
			? parseInt(system.args[5])
			: 0,
		page = webpage.create();

	// look for optional dimensions
	if(system.args.length >= 5) {
		page.viewportSize = {
			width: parseInt(system.args[3]),
			height: parseInt(system.args[4])
		}
	}

	page.onError = function(error, trace) {
		console.error('capture error: ' + error);
		phantom.exit(2);
	};

	page.open(sourcePath, function(status) {
		if(status === 'success') {
			window.setTimeout(function() {


				page.render(targetPath);
				phantom.exit(0);
			}, delay);
		} else {
			console.error('capture failed: ' + status);
			phantom.exit(2);
		}
	});
}