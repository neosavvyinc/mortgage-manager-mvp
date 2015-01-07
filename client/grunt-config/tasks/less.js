module.exports = {
    compile: {
        files: {
            'target/assets/css/main.min.css': [
                "src/main/assets/less/*.less"
            ]
        },
        options: {
            compress: true,
            sourceMap: true,
            sourceMapFilename: 'target/assets/css/main.min.css.map'
        }
    }
};
