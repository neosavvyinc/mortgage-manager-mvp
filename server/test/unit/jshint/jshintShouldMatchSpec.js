'use strict';

var fs = require('fs');
var _ = require('underscore');

describe('JSHint configuration test', function() {
	var loadJson = function loadJson(filename) {
		var text = fs.readFileSync(filename, 'utf-8');
		text = text.replace(new RegExp('//.*\n', 'gm'), '\n');
		return JSON.parse(text);
	};

	it('.jshintrc exists and json well-formatted', function() {
		expect(typeof loadJson('./.jshintrc')).toBe('object');
	});

	it('.jshintrc-test exists and json well-formatted', function() {
		expect(typeof loadJson('./.jshintrc-test')).toBe('object');
	});

	it('.jshintrc and .jshintrc-test should match with possible exception of globals and predef', function() {
		var jshint = loadJson('./.jshintrc');
		var jshintTest = loadJson('./.jshintrc-test');

		delete jshintTest.globals;
		delete jshintTest.predef;

		delete jshint.globals;
		delete jshint.predef;

		expect(jshint).toEqual(jshintTest);
	});

	it('.jshintrc-test globals and predef include .jshintrc ones', function() {
		var jshint = loadJson('./.jshintrc');
		var jshintTest = loadJson('./.jshintrc-test');

		_.each(jshint.predef || [], function(global) {
			if ((jshintTest.predef || []).indexOf(global) < 0) {
				expect('"' + global + '" missing in .jshintrc-test .predef').toBeFalsy();
			}
		});

		_.each(jshint.globals || {}, function(value, name) {
			if ((jshintTest.globals || {})[name] !== value) {
				expect('"' + name + '" mismatch in .jshintrc-test .globals').toBeFalsy();
			}
		});
	});
});
