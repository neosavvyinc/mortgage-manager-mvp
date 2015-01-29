'use strict';

var bCrypt = require('bcrypt-nodejs'),
	async = require('async'),
	LocalStrategy = require('passport-local').Strategy,
	loginService = require('../services/service-user'),
	userService = require('../services/service-user');
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
				res.status(409).
					send(err);
			}
			if(!user) {
				res.status(info.code)
					.send({message: info.message});
			} else {
				delete user.password;
				res.send(user);
			}
			res.end();
		})(req, res, next);
	};
};

/**
 * Register a new user
 * @param passport
 * @returns {Function}
 */
exports.registerUser = function(passport) {
	return function(req, res, next) {
		passport.authenticate('register', function(err, user, info) {
			if (err) {
				res.status(409).
					send(err);
			}
			if(!user) {
				res.status(info.code)
					.send({message: info.message});
			} else {
				res.send(user);
			}
			res.end();
		})(req, res, next);
	};
};

/**
 * Check if user's email already exists when creating a new user
 *
 */
exports.emailExists = function(req, res){
	var email = req.param('email');

	userService.emailExists(email, function() {
		res.send({message: 'Success'});
		res.end();
	}, function(error) {
		if(error) {
			res.status(400).send({message: 'The user already exists'});
		}
		res.end();
	});
};

/**
 * Private function that configures passport to check if username and password are valid.
 * @param passport
 * @private
 */
var _loginSetup = function(passport) {
	passport.use('login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
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
						return done(null, false, { code: 401, message: 'Invalid Credentials' });
					}
					// User exists but wrong password, log the error
					if (!_isValidPassword(user, password)) {
						return done(null, false, { code: 401, message: 'Invalid Credentials.' });
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
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback : true //allows us to pass back the entire request to the callback
			},
			function(req, username, password, done) {
				var findOrCreateUser = function() {
					// find a user in Mongo with provided username
					loginService.findUser({ email : username },
						function(err, users) {
							var user = users[0];
							// In case of any error, return using the done method
							if (err) {
								return done(err);
							}
							// already exists
							if (user) {
								return done(null, false, {code: 409, message: 'User Already Exists'});
							} else {
								// if there is no user with that email
								// create the user
								var userObject = req.body,
									userRegistered;

								async.series([
									function(callback){
										loginService.validateInviteToken(userObject, callback, callback);
									},
									function(callback){
										loginService.createUser(userObject, function(err, userDoc) {
											if(err) {
												//log.fatal
												callback({message: 'The user couldn\'t be created'});
											} else {
												userRegistered = userDoc;
												callback();
											}
										});
									}
								], function(error){
									if(error){
										return done(null, false, {code: 500, message: 'Internal server error'});
									} else {
										return done(null, userRegistered);
									}
								});

							}
						});
				};

				// Delay the execution of findOrCreateUser and execute the method
				// in the next tick of the event loop
				process.nextTick(findOrCreateUser);
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
