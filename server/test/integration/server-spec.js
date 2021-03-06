'use strict';

var http = require('http'),
	mongoose = require('mongoose/');

describe('Server', function() {
	var port = 3000;
	//Start the server

	beforeEach(function() {
		spyOn(mongoose, 'connect').andCallFake(function(url, success, failure) {
			failure(null);
		});

		require('../../lib/server');
	});

	describe('/healthcheck', function () {
		var host = 'http://localhost:' + port + '/api/healthcheck';

		it('should return 200', function (done) {
			http.get(host, function (res) {
				expect(res.statusCode).toBe(200);
				done();
			});
		});

		it('healthcheck should say ok', function (done) {
			http.get(host, function (res) {
				var data = '';

				res.on('data', function (chunk) {
					data += chunk;
				});

				res.on('end', function () {
					expect(data).toBe('ok');
					done();
				});
			});
		});
	});
});