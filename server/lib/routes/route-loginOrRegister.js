'use strict';

var bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy,
	loginService = require('../services/service-loginOrRegister');

/**
 *
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

/** Private Functions */

/**
 * Checks if username and password are valid.
 * @param passport
 */
var _loginSetup = function(passport) {
	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			// check in mongo if a user with username exists or not
			loginService.findUser({ 'email' :  username },
				function(err, user) {
					// In case of any error, return using the done method
					if (err) {
						return done(err);
					}
					// Username does not exist, log error & redirect back
					if (!user){
						console.log('User Not Found with username ' + username);
						return done(null, false, req.flash('message', 'User Not found.'));
					}
					// User exists but wrong password, log the error
					if (!_isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false, req.flash('message', 'Invalid Password'));
					}
					// User and password both match, return user from
					// done method which will be treated like success
					return done(null, user);
				}
			);
		}));
};

/**
 *
 * @param passport
 * @private
 */
var _registerSetup = function(passport){
	passport.use('signup', new LocalStrategy({
				passReqToCallback : true //allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			var findOrCreateUser = function() {
				// find a user in Mongo with provided username
				loginService.findUser({ 'username' :  username }, function(err, user) {
					// In case of any error, return using the done method
					if (err){
						console.log('Error in Registration: ' + err);
						return done(err);
					}
					// already exists
					if (user) {
						console.log('User already exists with username: ' + username);
						return done(null, false, req.flash('message','User Already Exists'));
					} else {
						// if there is no user with that email
						// create the user
						var userObject = req.param('userDetails');
						//userObject.password = _createHash(userObject.password);

						loginService.createUser(userObject, function(err) {
							if(err) {
								throw err;
							} else {
								return done(null, userObject);
							}
						});
						/* // set the user's local credentials
						newUser.username = username;
						newUser.password = _createHash(password);
						newUser.email = req.param('email');
						newUser.firstName = req.param('firstName');
						newUser.lastName = req.param('lastName');*/
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

/**
 * Generates hash using bCrypt
 * @param password
 * @returns {*}
 * @private
 */
var _createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};