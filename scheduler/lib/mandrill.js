'use strict';
/* jshint ignore:start */

var settings = require('./config/settings').getConfig(),
	mandrill = require('node-mandrill')(settings.mandrill.APIKey);

exports.sendBorrowerDigest = function(recipients, borrowersInfo, callback){

    var redirectURL = settings.hostURL;

    if(borrowersInfo) {
        mandrill('/messages/send-template', {
            template_name: 'borrower_digest',
            template_content: [],
            message: {
                auto_html: false,
                merge_language: 'handlebars',
                from_email: settings.mandrill.sourceEmail,
                from_name: 'NeoDoc',
                to: recipients,
                subject: 'Daily Digest',
                global_merge_vars: [
                    {
                        name: "companyName",
                        content: "NeoDoc"
                    },
                    {
                        name: "redirectURL",
                        content: redirectURL
                    }
                ],
                merge_vars: borrowersInfo
            }
        }, function (error) {
            if (error) {
                callback(error);
            } else {
                callback();
            }
        });
    } else {
        callback(new Error('there was an error sending the email.'));
    }
};

exports.sendLenderDigest = function(recipients, lendersInfo, callback){

    var redirectURL = settings.hostURL;

    if(lendersInfo) {
        mandrill('/messages/send-template', {
            template_name: 'lender_digest',
            template_content: [],
            message: {
                auto_html: false,
                merge_language: 'handlebars',
                from_email: settings.mandrill.sourceEmail,
                from_name: 'NeoDoc',
                to: recipients,
                subject: 'Daily Digest',
                global_merge_vars: [
                    {
                        name: "companyName",
                        content: "NeoDoc"
                    },
                    {
                        name: "redirectURL",
                        content: redirectURL
                    }
                ],
                merge_vars: borrowersInfo
            }
        }, function (error) {
            if (error) {
                callback(error);
            } else {
                callback();
            }
        });
    } else {
        callback(new Error('there was an error sending the email.'));
    }
};

/* jshint ignore:end */