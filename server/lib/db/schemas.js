'use strict';

var mongoose = require('mongoose/'),
	Schema = mongoose.Schema,
	Schemas = {};

/* Defining the mongoose schema for each collection we will use in this application */
Schemas.UserSchema = new Schema({
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
	coUID: { type: String, ref: 'UserSchema' },
	created: { type: Date, required: true },
	lastLogin: { type: Date, required: true },
	appId: [{ type: String, required: true, ref: 'ApplicationSchema' }]
});

Schemas.ApplicationSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	pUID: { type: String, required: true, ref: 'UserSchema' },
	coUID: { type: String, ref: 'UserSchema' },
	pEmail: {type: String, required:true, unique: true },
	created: { type:Date, required: true },
	lastModified: { type: Date, required: true }
});

Schemas.DocumentSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	appId: { type: String, required: true, ref: 'ApplicationSchema' },
	name: { type: String, required: true },
	type: { type: String, required: true },
	description: String,
	requesterId: { type: String, ref: 'UserSchema' },
	requestDate: Date,
	uploadDate: Date,
	lastViewed: { type: Date, required: true }
});

Schemas.LenderInvitesSchema = new Schema({
	_id: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	appId: { type: String, required: true, ref: 'ApplicationSchema' },
	isOpen: { type: Boolean, default: true }
});

Schemas.ApplicationLendersSchema = new Schema({
	lenderId: { type: String, required: true, ref: 'UserSchema' },
	appId: [{ type: String, required: true, ref: 'ApplicationSchema' }]
});

exports.Schemas = Schemas;