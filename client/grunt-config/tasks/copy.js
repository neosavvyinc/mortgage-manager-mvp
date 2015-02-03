module.exports = {
    browser: {
        files: [
            {
                expand:true,
                cwd:'<%= sourceDirectoryPath %>',
                src:[
                    'assets/images/*',
                    'assets/fonts/*',
                    'index.html'
                ],
                dest: '<%= buildOutputDirectoryPath %>/'
            },
            {
                expand:true,
                cwd:'<%= sourceDirectoryPath %>/assets/lib/groundworkcss',
                src:[
                    '*',
                ],
                dest: '<%= buildOutputDirectoryPath %>/assets/css/'
            },
            {
                expand:true,
                cwd:'<%= sourceDirectoryPath %>/lib/',
                src:[
                    'pdf.worker.js'
                ],
                dest: '<%= buildOutputDirectoryPath %>/js/'
            }
        ],
        options: {
            mode: true
        }
    },
    deploy: {
        files: [
            {
                expand:true,
                cwd:'<%= buildOutputDirectoryPath %>/',
                src: [
                    'assets/css/main.min.css'
                ],
                dest: 'deployment/'
            }
        ],
        options: {
            mode: true
        }
    }
};
