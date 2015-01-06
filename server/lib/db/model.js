'use strict';

var mongoose = require('mongoose/'),
	Schema = mongoose.Schema;

var LoginSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	type: { type: String, required: true },
	created: Date,
	lastLogin: Date
});

/* Model Objects */
exports.Login = mongoose.model('login', LoginSchema);