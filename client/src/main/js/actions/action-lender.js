'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    LenderActions;

LenderActions = Reflux.createActions([
    'newLender',
    'newPassword',
    'submitBasicInfo'
]);

module.exports = LenderActions;
