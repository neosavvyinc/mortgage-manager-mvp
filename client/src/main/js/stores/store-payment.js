'use strict';

var Reflux = require('reflux');
var PaymentActions = require('../actions/action-payment');

var isPremiumUser = false;

var PaymentStore = Reflux.createStore({
	listenables: PaymentActions,

	onUpgrade: function() {
		isPremiumUser = true;
		this.trigger();
	}
});

module.exports = PaymentStore;
