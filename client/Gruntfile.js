var initGruntConfig = require('./grunt-config/config');

module.exports = function (grunt) {
    var config = { pkg: grunt.file.readJSON('package.json'), root: true};
    initGruntConfig(grunt, __dirname, config);

    grunt.registerTask('verify', [
        'shell:testLess',
        'shell:npmInstall'
    ]);
    grunt.registerTask('clean', [
        'shell:cleanTarget'
    ]);
    grunt.registerTask('resolve', [
        'bower:install'
    ]);
    grunt.registerTask('compile', [
        'shell:buildVersion',
        'less:compile',
        'browserify:compile',
        'copy:browser'
    ]);
    grunt.registerTask('runTests', [
        'jest:unit'
    ]);
    grunt.registerTask('deploy', []);

    grunt.registerTask('default', [
        'verify',
        'clean',
        'resolve',
        'compile',
        'runTests'
    ]);
    grunt.registerTask('deploy', [
        'verify',
        'clean',
        'resolve',
        'compile',
        'runTests',
        'deploy'
    ]);
    grunt.registerTask('watchify', [
        'browserify:watch'
    ]);

    grunt.registerTask('start', [
        'shell:testNginx',
        'shell:symLink',
        'shell:startNginx'
    ]);
    grunt.registerTask('stop', [
        'shell:testPkill',
        'shell:rmSymLink',
        'shell:stopNginx'
    ]);
    grunt.registerTask('restart', [
        'stop',
        'start'
    ])

}
