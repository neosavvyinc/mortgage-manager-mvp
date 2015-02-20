'use strict';

var Reflux = require('reflux'),
    LenderActions;

LenderActions = Reflux.createActions([
    'newLender',
    'newPassword',
    'submitBasicInfo',
    'inviteLender',
    'setLenderList',
    'removeLenderInvite'
]);

module.exports = LenderActions;
