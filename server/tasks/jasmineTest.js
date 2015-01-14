'use strict';

module.exports = function(grunt) {
	grunt.registerTask('jasmineTests', 'Runs jasmine node tests according to the environment', function() {
		var config = {
			coverage: false,
			options: {
				forceExit: false,
				match: '.',
				matchall: false,
				extensions: 'js',
				specNameMatcher: 'spec',
				isVerbose: false
			}
		};

		if(process.env.TEST_ENV === 'unittest') {
			config.specFolders = ['test/unit'];
		} else if(process.env.TEST_ENV === 'integration') {
			config.specFolders = ['test/integration'];
		} else {
			config.specFolders = ['test/unit', 'test/integration'];
		}

		grunt.config.set('jasmine_node', config);
		grunt.task.run(['jasmine_node']);
	});
};