module.exports = {
    options: {
        compress: true
    },
    compile: {
        files: {
            'target/assets/css/main.min.css': [
                'src/main/assets/less/**/*.less'
            ]
        }
    }
};
