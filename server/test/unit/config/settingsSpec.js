'use strict';

var settings = require('../../../lib/config/settings');

describe('settings', function() {

	it('should set the config and get the same config', function() {
		var config = {
			foo: 'foo',
			blah: 'blah'
		}, getConf;
		settings.setConfig(JSON.stringify(config));
		getConf = settings.getConfig();
		expect(config).toEqual(getConf);
	});
});