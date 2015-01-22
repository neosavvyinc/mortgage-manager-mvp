'use strict';

var Reflux = require('reflux'),
    LenderActions;

LenderActions = Reflux.createActions([
    'newLender',
    'newPassword',
    'submitBasicInfo'
]);

module.exports = LenderActions;
