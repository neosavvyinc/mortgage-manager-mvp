module.exports = function(){
    return {
        USER: {
            URL: '/user',
            ONE: {
                URL: '/user/:id',
                COAPPLICANT: {
                    URL: '/user/:id/coapplicant'
                }
            }
        },
        LOGIN: {
            URL: '/login'
        },
        REGISTER: {
            URL: '/register'
        }
    };
};