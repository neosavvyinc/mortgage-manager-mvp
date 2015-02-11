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

exports.sendLenderDigest = function(lenderEmail, lenderInfo, callback){
    var redirectURL = settings.hostURL;

    if(lenderInfo) {
        mandrill('/messages/send-template', {
            template_name: 'lender_digest',
            template_content: [],
            message: {
                auto_html: false,
                to: [
                    {
                        email: lenderEmail,
                        name: lenderInfo.firstName + " " + lenderInfo.lastName
                    }
                ],
                from_email: settings.mandrill.sourceEmail,
                from_name: 'DoubleApp Team',
                subject: 'Daily Digest',
                merge_vars: [{
                    rcpt: lenderEmail,
                    vars: [
                        {
                            name: "borrowerFName",
                            content: lenderInfo.firstName
                        },
                        {
                            name: "borrowerLName",
                            content: lenderInfo.lastName
                        },
                        {
                            name: "redirectURL",
                            content: redirectURL
                        }
                    ]
                }]
            }
        }, function (error) {
            if (error) {
                callback(error);
            } else {
                callback();
            }
        });
    } else {
        // log error
        callback();
    }
};

/* jshint ignore:end */