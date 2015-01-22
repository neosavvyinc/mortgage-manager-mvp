module.exports = {
    USER: {
        URL: '/api/user',
        ONE: {
            URL: '/api/user/:id',
            COAPPLICANT: {
                URL: '/api/user/:id/coapplicant'
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
    }
};