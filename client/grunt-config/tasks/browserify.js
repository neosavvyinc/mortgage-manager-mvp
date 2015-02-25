module.exports = {
    compile: {
        options: {
            transform: [ 'reactify' ]
        },
        files: {
            'target/js/bundle.js': ['src/main/js/**/*.js'],
            'target/js/vendor.js': [
                'src/main/lib/pdf.js',
                'node_modules/jquery/dist/jquery.min.js'
            ]
        }
    },
    watch: {
        options: {
            watch: true,
            keepAlive: true,
            transform: ['reactify']
        },
        files: {
            'target/js/bundle.js': ['src/main/js/**/*.js']
        }
    }
};
