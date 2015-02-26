var Reflux = require('reflux');

var User = require('../models/model-user');
var ApplicationActions = require('../actions/action-application');

var _application = {},
    _hasCoapplicant = false;

var ApplicationStore = Reflux.createStore({

    listenables: ApplicationActions,

    onSelectApplication: function(application){
        _application = application;
        this.trigger();
    },

    onReSendInvite: function(){
        this.trigger();
    },

    onAddCoapplicant: function(){
        _hasCoapplicant = true;
        this.trigger();
    },

    hasCoapplicant: function(){
        return _hasCoapplicant;
    },

    getCurrentApplication: function(){
        return _application;
    }
});

module.exports = ApplicationStore;
