'use strict';

var mongoose = require('mongoose/'),
	Schemas = require('../schemas').Schemas,
	userSchema = Schemas.UserSchema,
	userModel = mongoose.model('user', userSchema);



