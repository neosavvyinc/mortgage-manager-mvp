var Reflux = require('reflux');

var UserActions = Reflux.createActions([
    'login',
    'logout',
	'receiveCurrentUser'
]);

module.exports = UserActions;
