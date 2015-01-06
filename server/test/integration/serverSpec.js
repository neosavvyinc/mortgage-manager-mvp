'use strict';

var http = require('http');

describe('Server', function() {
	var port = 3000;
	//Start the server
	require('../../lib/server');

	describe('/healthcheck', function () {
		var host = 'http://localhost:' + port + '/healthcheck';

		it('should return 200', function (done) {
			http.get(host, function (res) {
				expect(res.statusCode).toBe(200);
				done();
			});
		});

		it('healthcheck say ok', function (done) {
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