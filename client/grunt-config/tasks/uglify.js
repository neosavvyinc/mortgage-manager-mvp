module.exports = {
    deploy: {
        options: {
            compress: {
                drop_console: true
            }
        },
        files: {
            'deployment/bundle.min.js': ['target/js/bundle.js']
        }
    }
};
