'use strict';

var bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy,
	loginService = require('../services/service-loginOrRegister');

/**
 * Initializes passport for the application. Creates function to serialize and deserialize
 * users.
 * @param passport
 */
exports.initPassport = function(passport) {
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		loginService.findUser({ _id: id }, done);
	});

	// Setting up Passport Strategies for Login and SignUp/Registration
	_loginSetup(passport);
	_registerSetup(passport);
};

/**
 * Validates username and password through passport
 * @param passport
 */
exports.validateLogin = function(passport) {
	return function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) {
				res.send(err);
			}
			if(!user) {
				res.send(info);
			} else {
				res.send({ code: 200, message: 'Success' });
			}
			res.end();
		})(req, res, next);
	};
};

/**
 * Registers a new user through passport
 * @param passport
 */
exports.registerUser = function(passport) {
	return passport.authenticate('register', { failureFlash: true });
};

/**
 * Private function that configures passport to check if username and password are valid.
 * @param passport
 * @private
 */
var _loginSetup = function(passport) {
	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			// check in mongo if a user with username exists or not
			loginService.findUser({ email :  username },
				function(err, users) {
					var user = users[0];

					// In case of any error, return using the done method
					if (err) {
						return done(err);
					}
					// Username does not exist, log error & redirect back
					if (!user) {
						return done(null, false, { code: 400, message: 'User Not found.' });
					}
					// User exists but wrong password, log the error
					if (!_isValidPassword(user, password)) {
						return done(null, false, { code: 400, message: 'Incorrect password.' });
					}
					// User and password both match, return user from
					// done method which will be treated like success
					return done(null, user);
				}
			);
		}));
};

/**
 * Private function that configures passport to register a new user.
 * @param passport
 * @private
 */
var _registerSetup = function(passport){
	passport.use('register', new LocalStrategy({
			passReqToCallback : true //allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

		})
	);
};

/**
 * Checks if a password is valid
 * @param user
 * @param password
 * @returns {*}
 * @private
 */
var _isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
};

/**
 * Generates hash using bCrypt
 * @param password
 * @returns {*}
 * @private
 */
var _createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};