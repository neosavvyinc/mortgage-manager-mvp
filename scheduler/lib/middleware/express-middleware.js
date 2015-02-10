'use strict';

var  bodyParser = require('body-parser');

module.exports = function(app, router, passport) {
    // for parsing application/json
    app.use(bodyParser.json({limit: '5mb'}));

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

};

