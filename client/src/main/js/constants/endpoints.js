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
    REGISTER: {
        URL: '/api/register'
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
                ONE: {
                    URL: '/api/applications/:id/download/:docId'
                }
            },
            LENDERS: {
                URL: '/api/applications/:id/lenders',
                REINVITE: {
                    URL: '/api/applications/:id/lenders/resend-invite'
                }
            },
            BORROWERS: {
                URL: '/api/applications/:id/borrowers'
            }
        }
    }
};