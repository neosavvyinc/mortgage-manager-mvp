'use strict';

var mongoose = require('mongoose/'),
	Schema = mongoose.Schema;

/* Defining the mongoose schema for each collection we will use in this application */
var UserSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	middleName: String,
	lastName: { type: String, required: true },
	address: { type: String, required: true },
	city: {type: String, required: true },
	state: { type: String, required: true },
	zip: { type: Number, required: true },
	phone: { type: Number, required: true, unique: true },
	type: { type: String, required: true },
	coUID: String,
	created: { type: Date, required: true },
	lastLogin: { type: Date, required: true },
	appId: { type: String, required: true }
});

var ApplicationSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	pUID: { type: String, required: true },
	coUID: String,
	created: { type:Date, required: true },
	lastModified: { type: Date, required: true }
});

var DocumentSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	appId: { type: String, required: true },
	name: { type: String, required: true },
	type: { type: String, required: true },
	description: String,
	requesterId: String,
	requestDate: Date,
	uploadDate: Date,
	lastViewed: { type: Date, required: true }
});

var LenderInvitesSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	appId: { type: String, required: true },
	isOpen: { type: Boolean, default: true }
});

var ApplicationLendersSchema = new Schema({
	lenderId: { type: String, required: true },
	appId: { type: String, required: true }
});

/* Model Objects */
exports.User = mongoose.model('user', UserSchema);
exports.Application = mongoose.model('application', ApplicationSchema);
exports.Document = mongoose.model('document', DocumentSchema);
exports.LenderInvites = mongoose.model('lenderInvites', LenderInvitesSchema);
exports.ApplicationLenders = mongoose.model('applicationLenders', ApplicationLendersSchema);