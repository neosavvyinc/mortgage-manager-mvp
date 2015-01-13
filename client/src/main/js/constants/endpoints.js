module.exports = function(){
    return {
        USER: {
            URL: '/user',
            ONE: {
                URL: '/user/:id'
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