'use strict';

var Validator = require('jsonschema').Validator;
var ValidationSchemas = require('../validators/form-schema-validators');

/**
 * {
 *    "valid": false,
 *    "error": {...},
 *    "missing": [...]
 * }
 */

exports.validatePassword = function(password){
    var v = new Validator();
    return v.validate(password, ValidationSchemas.passwordJSONSchema);
};

exports.validatePhone = function(phone){
    var v = new Validator();
    return v.validate(phone, ValidationSchemas.phoneJSONSchema);
};

exports.validateEmail = function(email){
    var v = new Validator();
    return v.validate(email, ValidationSchemas.emailJSONSchema);
};

exports.validateUser = function(user){
    var v = new Validator();
    return v.validate(user, ValidationSchemas.userJSONSchema);
};