'use strict';
/* jshint ignore:start */

var settings = require('../config/app/settings');
var mandrill = require('node-mandrill');


var mandrillApi;

var initializeApi = function() {
    if( !mandrillApi ){
        mandrillApi = mandrill(settings.getConfig().mandrill.APIKey);
    }
};

/**
 * Send invite mandrill service method
 * @param lenderInfo
 * @param sender
 * @param appId
 * @param token
 * @param callback
 */
exports.sendInvite = function(lenderInfo, sender, appId, token, callback) {
    initializeApi();
	var redirectURL = settings.getConfig().hostURL +
						'/register/new-lender?token=' + token +
						'&email=' + lenderInfo.email +
						'&firstName=' + lenderInfo.firstName +
						'&lastName=' + lenderInfo.lastName +
						'&organization=' + lenderInfo.organization +
						'&appId=' + appId;

    mandrillApi('/messages/send-template', {
		template_name: 'lender_invite',
		template_content: [],
		message: {
			auto_html: false,
			to: [
				{
					email: lenderInfo.email,
					name: lenderInfo.firstName + " " + lenderInfo.lastName
				}
			],
			from_email: settings.getConfig().mandrill.sourceEmail,
			from_name: 'DocSwap Team',
			subject: 'You have received an invitation',
			merge_vars: [{
				rcpt: lenderInfo.email,
				vars: [
					{
						name: "lenderFName",
						content: lenderInfo.firstName
					},
					{
						name: "lenderLName",
						content: lenderInfo.lastName
					},
					{
						name: "senderFName",
						content: sender.firstName
					},
					{
						name: "senderLName",
						content: sender.lastName
					},
					{
						name: "redirectURL",
						content: redirectURL
					}
				]
			}]
		}
	}, function(error) {
		if (error){
			callback(error);
		} else {
			callback();
		}
	});
};

exports.forgotPassword = function(email, userDetails, token, callback) {
    initializeApi();
	var redirectURL = settings.getConfig().hostURL +
		'/register/update-password?token=' + token +
		'&uid=' + userDetails._id;

    mandrillApi('/messages/send-template', {
		template_name: 'forgot_password',
		template_content: [],
		message: {
			auto_html: false,
			to: [
				{
					email: email,
					name: userDetails.firstName + " " + userDetails.lastName
				}
			],
			from_email: settings.getConfig().mandrill.sourceEmail,
			from_name: 'DocSwap Team',
			subject: 'Password Reset',
			merge_vars: [{
				rcpt: email,
				vars: [
					{
						name: "FName",
						content: userDetails.firstName
					},
					{
						name: "LName",
						content: userDetails.lastName
					},
					{
						name: "sender",
						content: 'DocSwap Team'
					},
					{
						name: "redirectURL",
						content: redirectURL
					}
				]
			}]
		}
	}, function(error) {
		if (error){
			callback(error);
		} else {
			callback();
		}
	});
};

exports.sendPassword = function(userInfo, password, callback){
    initializeApi();
    var redirectURL = settings.getConfig().hostURL + '?changePassword=true';

    mandrillApi('/messages/send-template', {
        template_name: 'new_password',
        template_content: [],
        message: {
            auto_html: false,
            to: [
                {
                    email: userInfo.email,
                    name: userInfo.firstName + " " + userInfo.lastName
                }
            ],
            from_email: settings.getConfig().mandrill.sourceEmail,
            from_name: 'DocSwap Team',
            subject: 'New Account Password',
            merge_vars: [{
                rcpt: userInfo.email,
                vars: [
                    {
                        name: "FName",
                        content: userInfo.firstName
                    },
                    {
                        name: "LName",
                        content: userInfo.lastName
                    },
                    {
                        name: "redirectURL",
                        content: redirectURL
                    },
                    {
                        name: "newPassword",
                        content: password
                    }
                ]
            }]
        }
    }, function(error) {
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
};