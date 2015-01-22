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
    DOCUMENT: {
        URL: '/api/application',
        UPLOAD: {
            URL: '/api/application/:appId/document'
        }
    },
    LOGIN: {
        URL: '/api/login'
    },
    REGISTER: {
        URL: '/api/register'
    },
    APPLICATIONS: {
        URL: '/api/applications',
        ONE: {
            URL: '/api/applications/:id',
            DOCUMENTS: {
                URL: '/api/applications/:id/documents'
            }
        }
    }
};