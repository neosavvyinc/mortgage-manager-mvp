'use strict';

var Reflux = require('reflux'),
    TabActions = require('../actions/action-tabs'),
    tabName;

var TabStore = Reflux.createStore({

    listenables: TabActions,

    onSwitchPanel: function(newTabName){
        tabName = newTabName;
        this.trigger();
    },

    getNextTabName: function(){
        return tabName;
    }

});

module.exports = TabStore;
