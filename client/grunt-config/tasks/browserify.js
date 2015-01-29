module.exports = {
    compile: {
        options: {
            transform: [ 'reactify' ]
        },
        files: {
          'target/js/bundle.js': ['src/main/lib/pdf.js', 'src/main/js/**/*.js']
        }
    },
    watch: {
        options: {
            watch: true,
            keepAlive: true,
            transform: ['reactify']
        },
        files: {
            'target/js/bundle.js': ['src/main/lib/pdf.js', 'src/main/js/**/*.js']
        }
    }
};
