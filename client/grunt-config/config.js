var path = require('path');

module.exports = function (grunt, dirname, config) {
    'use strict';
    var _ = grunt.util._;
    var configPath = config.root ? path.join(dirname, 'grunt-config/tasks') : path.join(dirname, '../grunt-config/tasks');

    _.extend(config,
        require('load-grunt-config')(grunt, {
            configPath: configPath,
            overridePath: path.join(dirname, 'tasks'),
            init: false,
            data: {
                name: '<%= pkg.name %>',
                librariesPath: '<%= pkg.paths.libraries %>',
                buildOutputDirectoryPath: '<%= pkg.paths.buildOutputDirectory %>',
                sourceDirectoryPath: '<%= pkg.paths.sourceDirectory %>'
            },
            loadGruntTasks: {
                pattern: 'grunt-*',
                config: require('../package.json'),
                scope: 'devDependencies'
            }
        })
    );

    grunt.initConfig(config);
};
