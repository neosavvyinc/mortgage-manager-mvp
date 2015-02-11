module.exports = {
    deploy: {
        options: {
            compress: {
                drop_console: true
            },
	        mangle: true
        },
        files: {
            'deployment/js/bundle.min.js': ['target/js/bundle.js'],
            'deployment/js/vendor.min.js': ['target/js/vendor.js']
        }
    }
};
