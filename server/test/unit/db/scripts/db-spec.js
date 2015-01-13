'use strict';

var db = require('../../../../lib/db/scripts/db'),
	mongoose = require('mongoose/'),
	commonUtils = require('../../../../lib/utils/common-utils');

describe('Database', function() {
	describe('connect', function() {
		var connectSpy;
		beforeEach(function() {
			connectSpy = spyOn(mongoose, 'connect');
		});

		it('should fail on error', function() {
			connectSpy.andCallFake(
				function(url, options, callback) {
					callback('fail');
				});

			db.connect('url',
				function() {
					expect().toHaveNotExecuted('Test failed. Should not be here');
				},
				function(error) {
					expect(mongoose.connect.callCount).toBe(1);
					expect(error.message).toBe('fail');
				});
		});

		it('should succeed if already connected', function() {
			connectSpy.andCallFake(
				function(url, options, callback) {
					var err = new Error('Already Connected');
					err.state = 1;
					callback(err);
				});

			db.connect('url',
				function() {
					expect(mongoose.connect.callCount).toBe(1);
				},
				function() {
					expect().toHaveNotExecuted('Test failed. Should not be here');
				});
		});

		it('should succeed if there is no error', function() {
			connectSpy.andCallFake(
				function(url, options, callback) {
					callback();
				});

			db.connect('url',
				function() {
					expect(mongoose.connect.callCount).toBe(1);
				},
				function() {
					expect().toHaveNotExecuted('Test failed. Should not be here');
				});
		});
	});

	describe('disconnect', function() {
		beforeEach(function() {
			spyOn(mongoose, 'disconnect').andCallFake(function(callback) {
				callback();
			});
		});

		afterEach(function() {
			mongoose.connection_.restore();
		});

		it('should callback immediately if there is no connection', function(done) {
			//Doing it the way it is done in Tesla for now. Have an idea that I will
			//try out and implement later.
			commonUtils.stubGetter(mongoose, 'connection', function() {
				return null;
			});
			db.disconnect(function() {
				done();
			});
			expect(mongoose.disconnect.callCount).toBe(0);
		});

		it('should call disconnect with callback if connection exists', function(done) {
			commonUtils.stubGetter(mongoose, 'connection', function() {
				return true;
			});
			db.disconnect(function() {
				done();
			});
			expect(mongoose.disconnect.callCount).toBe(1);
		});
	});

	describe('clear', function() {
		var connectSpy;
		beforeEach(function() {
			connectSpy = spyOn(mongoose, 'connect');
		});

		afterEach(function() {
			mongoose.connection_.restore();
		});

		it('should fail if connection is null', function() {
			commonUtils.stubGetter(mongoose, 'connection', function() {
				return null;
			});

			db.clear(function() {
				expect().toHaveNotExecuted('Should not succeed.');
			},
			function(error) {
				expect(error.message).toBe('not opened');
			});
		});

		it('should fail if connection exists and dropdatabase fails', function() {
			//Doing it the way it is done in Tesla for now. Have an idea that I will
			//try out and implement later.
			commonUtils.stubGetter(mongoose, 'connection', function() {
				return {
					url: 'url',
					db: {
						dropDatabase: function(callback) {
							callback(new Error('fail'));
						}
					}
				};
			});

			db.clear(
				function() {
					expect().toHaveNotExecuted('Should not have succeeded.');
				},
				function(error) {
					expect(error.message).toBe('fail');
				});
		});

		it('should attempt to connect if dropDatabase succeeds', function() {
			spyOn(db, 'connect').andCallFake(function(url, success, failure) {
				expect(url).toBe('url');
				success();
			});

			//Doing it the way it is done in Tesla for now. Have an idea that I will
			//try out and implement later.
			commonUtils.stubGetter(mongoose, 'connection', function() {
				return {
					url: 'url',
					db: {
						dropDatabase: function(callback) {
							callback();
						}
					}
				};
			});

			db.clear(
				function() {
					expect(db.connect.callCount).toBe(1);
				},
				function(error) {
					expect().toHaveNotExecuted('Test failed. Should not be here');
				});
		});
	});
});
