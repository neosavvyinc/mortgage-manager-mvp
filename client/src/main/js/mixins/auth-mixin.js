var _authentication = {
    statics: {
        willTransitionTo: function(transition) {
            /*if(!authenticated()){
                transition.redirect('main');
            }*/
        }
    }
};

var Authentication = {
    Authenticated: _authentication
}

module.exports = Authentication;
