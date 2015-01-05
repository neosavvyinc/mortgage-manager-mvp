'use strict';

module.exports = function gruntFile(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		shell: {
			//application scripts
			stop: {
				command: './lib/app.sh stop server.js',
				options: {
					async: false
				}
			},
			start: {
				command: './lib/app.sh start server.js&',
				options: {
					async: false,
					execOptions: {
						detached: true
					}
				}
			},
			startDb: {
				command: './lib/app.sh start mongod&',
				options: {
					async: true,
					execOptions: {
						detached: true
					}
				}
			},

			populate: {
				command: 'node lib/db/db-run.js create',
				options: {
					async: false,
					execOptions: {
						detached: true
					}
				}
			}
		},

		jshint: {
			options: {
				jshintrc: './.jshintrc'
			},
			grunt: ['./*.js'],
			server: ['./lib/**/*.js'],
			test: {
				options: {
					jshintrc: './.jshintrc-test'
				},
				files: {
					src: ['./test/**/*.js']
				}
			}
		},

		compress: {
			build: {
				options: {
					archive: 'build/Uni.tgz',
					mode: 'tgz'
				},
				files: [
					{src: ['build/**']}
				]
			}
		},

		copy: {
			build: {
				files: [
					{ expand: true, src: ['lib/**'], dest: 'build/' },
					{ expand: true, src: ['config/**'], dest: 'build/' },
					{ expand: true, src: ['tasks/**'], dest: 'build/' },
					{ expand: true, src: ['Gruntfile.js'], dest: 'build/' },
					{ expand: true, src: ['package.json'], dest: 'build/' }
				]
			},
			options: {
				mode: true
			}
		},

		clean: {
			coverage: ['coverage/'],
			build: ['build/']
		}
	});

	// Load all NPM packages that start with grunt-
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Load all custom tasks
	grunt.loadTasks('tasks');

	// Register our tasks
	grunt.registerTask('static-analysis', 'Runs static analysis of the source code',
		['jshint']);

	grunt.registerTask('coverage', 'Runs code coverage', function runCodeCoverage() {
		grunt.task.run('static-analysis');
		grunt.task.run(['_coverage']);
	});

	grunt.registerTask('coverage-jenkins', 'Runs code coverage (jenkins)', function runCodeCoverage() {
		process.env.COVERAGE_TARGET = 'jenkins';
		grunt.task.run(['_coverage']);
	});

	grunt.registerTask('unit-test', 'Runs unit tests', function runUnitTests() {
		process.env.TEST_ENV = 'unittest';
		grunt.task.run('jasmineTests');
	});

	grunt.registerTask('integration-test', 'Runs integration tests', function runIntegrationTests() {
		process.env.TEST_ENV = 'integration';
		grunt.task.run('jasmineTests');
	});

	grunt.registerTask('test', 'Runs unit and integration tests', function() {
		grunt.task.run(['jasmineTests']);
	});

	grunt.registerTask('start', 'Start server at localhost:' + LOCAL_SERVICE_PORT, function start() {
		process.env.NODE_ENV = process.env.NODE_ENV || 'development';
		grunt.task.run('shell:stop', 'shell:startDb', 'shell:start');
	});

	grunt.registerTask('populate', 'Populates all json files into mongo', function() {
		grunt.task.run(['shell:populate']);
	});

	grunt.registerTask('build', [
		'static-analysis',
		'clean:build',
		'copy:build',
		'compress:build'
	]);

	grunt.registerTask('default', [
		'static-analysis',
		'test'
	]);
};