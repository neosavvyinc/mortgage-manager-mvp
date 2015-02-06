'use strict';
/* jshint ignore:start */

var settings = require('./config/settings').getConfig(),
	mandrill = require('node-mandrill')(settings.mandrill.APIKey);


exports.sendBorrowerDigest = function(borrowerEmail, borrowerInfo, callback){

    var redirectURL = settings.hostURL;

    if(borrowerInfo) {
        mandrill('/messages/send-template', {
            template_name: 'borrower_digest',
            template_content: [],
            message: {
                auto_html: false,
                to: [
                    {
                        email: borrowerEmail,
                        name: borrowerInfo.firstName + " " + borrowerInfo.lastName
                    }
                ],
                from_email: settings.mandrill.sourceEmail,
                from_name: 'DoubleApp Team',
                subject: 'Daily Digest',
                merge_vars: [{
                    rcpt: borrowerEmail,
                    vars: [
                        {
                            name: "borrowerFName",
                            content: borrowerInfo.firstName
                        },
                        {
                            name: "borrowerLName",
                            content: borrowerInfo.lastName
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
        // LOG ERRROR
        callback();
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