'use strict';

var mongoose = require('mongoose/'),
	Schema = mongoose.Schema,
	Types = Schema.Types;

var LoginSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	type: { type: String, required: true },
	created: Types.Date,
	lastLogin: Types.Date
});

/* Model Objects */
exports.Login = mongoose.model('logins', LoginSchema);