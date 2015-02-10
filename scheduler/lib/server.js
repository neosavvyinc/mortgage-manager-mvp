'use strict';

var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    express = require('express'),
    settings = require('./config/settings'),
    app = express(),
    db = require('./db/scripts/db'),
    middleware = require('./middleware/express-middleware'),
    scheduler, server, log;

/**
 * Listens on a port
 */
exports.listen = function () {
    server = app.listen.apply(app, arguments);
};

/**
 * Function to load the config
 */
var loadConfig = function() {
    var config = fs.readFileSync('./lib/config/scheduler-config.json', 'utf8');
    //var config = fs.readFileSync('./config/scheduler-config.json', 'utf8');
    settings.setConfig(config);
};

/**
 * Function that starts the server and listens on a port.
 */
var runServer = function() {
    var port = settings.getConfig().port;

    //Start listening on localhost
    exports.listen(port);

    scheduler.initScheduler();

    log.info('Node scheduler listening on port %d', port);
};

/**
 * Block that runs when this script is executed.
 */
async.series([
    function(done) {
        loadConfig();
        done();
    },
    function(done) {
        log = require('./utils/common-utils').getLogger();
        settings.log = log;
        done();
    },
    function(done) {
        db.connect(settings.getConfig().dbURL, done, done);
    },
    function(done){
        middleware(app);
        done();
    },
    function(done) {
        scheduler = require('./scheduler');
        runServer();
        done();
    }
], function(error) {
    if(error !== undefined) {
        log.fatal(error);
    }
});