module.exports = {
	USER: {
        URL: '/api/user',
        ONE: {
            URL: '/api/user/:id',
            COAPPLICANT: {
                URL: '/api/user/:id/coapplicant'
            },
            APPLICATIONS: {
                URL: '/api/user/:id/applications'
            },
            UPDATEPASSWORD: {
                URL: '/api/user/:id/update-password'
            },
	        TRIALEXPIRED: {
		        URL: '/api/user/:id/checkTrialExpired'
	        }
        }
    },
    LOGIN: {
        URL: '/api/login',
        WITHTOKEN: {
            URL: '/api/login/token'
        }
    },
    LOGOUT: {
        URL: '/api/logout'
    },
    ISAUTHENTICATED: {
        URL: '/api/is-authenticated'
    },
    REGISTER: {
        URL: '/api/register'
    },
    FORGOTPASSWORD: {
        URL: '/api/forgot-password'
    },
    EMAIL: {
        URL: '/api/email-exists'
    },
    APPLICATIONS: {
        URL: '/api/applications',
        ONE: {
            URL: '/api/applications/:id',
            DOCUMENTS: {
                URL: '/api/applications/:id/documents',
                ONE: {
                    URL: '/api/applications/:id/documents/:docId'
                }
            },
            DOCUMENTENTRY: {
                URL: '/api/applications/:id/documentEntry'
            },
            FILE :{
                ONE: {
                    URL: '/api/applications/:id/file/:docId'
                }
            },
            DOWNLOAD :{
	            URL: '/api/applications/:id/download',
                ONE: {
                    URL: '/api/applications/:id/download/:docId'
                }
            },
            LENDERS: {
                URL: '/api/applications/:id/lenders',
                REINVITE: {
                    URL: '/api/applications/:id/lenders/resend-invite'
                },
                UNINVITE: {
                    URL: '/api/applications/:id/lenders/uninvite'
                }
            },
            BORROWERS: {
                URL: '/api/applications/:id/borrowers'
            }
        }
    },
	PAYMENT: {
		URL: '/api/payment/:token'
	},
	STRIPE: {
		URL: '/api/payment/publishableKey'
	}
};