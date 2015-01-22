var Reflux = require('reflux');

var User = require('../models/model-user');
var ApplicationActions = require('../actions/action-application');

var _application = {};

var ApplicationStore = Reflux.createStore({

    listenables: ApplicationActions,

    onSelectApplication: function(application){
        _application = application;
        this.trigger();
    },

    getCurrentApplication: function(){
        return _application;
    }

});

module.exports = ApplicationStore;
