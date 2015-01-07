module.exports = {
    browser: {
        files: [
            {
                expand:true,
                cwd:'<%= sourceDirectoryPath %>',
                src:[
                    'assets/images/*',
                    'index.html'
                ],
                dest: '<%= buildOutputDirectoryPath %>/'
            },
        ]
    }
};
