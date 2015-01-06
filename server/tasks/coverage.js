'use strict';

var path = require('path');

module.exports = function(grunt) {
	grunt.registerTask('_coverage', 'Custom task for running unit tests with coverage and reporting', function() {
		var config = {
			coverage: {
				print: 'detail', // none, summary, detail, both
				relativize: true,
				options: {
					statements: 0,
					branches: 0,
					lines: 0,
					functions: 0
				},
				savePath: 'coverage',
				report: [
					'html'
				],
				collect: [ // false to disable
					'coverage/*coverage.json'
				],
				excludes: [
					'build/**',
					'config/**',
					'coverage/**',
					'deployment/**',
					'shared/**',
					'tasks/**',
					'test/**/*.js',
					'lib/server.js']
			},
			options: {
				forceExit: false,
				match: '.',
				matchall: false,
				extensions: 'js',
				isVerbose: false,
				specNameMatcher: 'spec',
				specFolders: ['test/unit']
			}
		}, taskList = ['clean:coverage', 'jasmine_node'];

		if(process.env.COVERAGE_TARGET === 'jenkins') {
			config.coverage.report = ['cobertura'];
		}

		grunt.config.set('jasmine_node', config);

		if(grunt.option('openBrowser') === true) {
			taskList.push('_open');
		}

		grunt.task.run(taskList);
	});

	grunt.registerTask('_open', 'displays coverage report in chrome', function() {
		grunt.config.set('open', {
			coverage: {
				path: path.resolve('coverage/index.html'),
				app: 'Google Chrome'
			}
		});
		grunt.task.run(['open']);
	});
};