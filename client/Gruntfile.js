var initGruntConfig = require('./grunt-config/config');

module.exports = function (grunt) {
    var config = { pkg: grunt.file.readJSON('package.json'), root: true};
    initGruntConfig(grunt, __dirname, config);

    grunt.registerTask('verify', [
        'shell:testLess',
        'shell:npmInstall'
    ]);
    grunt.registerTask('clean', [
        'shell:cleanDeployment',
        'shell:cleanTarget'
    ]);
    grunt.registerTask('resolve', []);
    grunt.registerTask('compile', [
        'shell:buildVersion',
        'less:compile',
        'browserify:compile',
        'copy:browser'
    ]);
    grunt.registerTask('runTests', [
        'jest:unit'
    ]);
    grunt.registerTask('deploy', [
        'uglify:deploy',
        'htmlrefs:deploy',
        'copy:deploy'
    ]);

    grunt.registerTask('default', [
        'verify',
        'clean',
        'resolve',
        'compile',
        'runTests'
    ]);

    grunt.registerTask('deployment', [
        'verify',
        'clean',
        'resolve',
        'compile',
        'runTests',
        'deploy',
        'compress'
    ]);

    grunt.registerTask('fuckYoTest', [
        'verify',
        'clean',
        'resolve',
        'compile'
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
    ]);

};
