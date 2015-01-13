var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Main = require('../views/view-welcome');
var Dashboard = require('../views/view-dashboard');

/* Default Root Handler */
var RootDefault = React.createClass({
    mixins: [Router.State],
    render: function(){
        return (
            <RouterHandler />
        )
    }
});

var routes = (
    <Route name="root" path="/welcome" handler={RootDefault}>
        <DefaultRoute name="main" handler={Main} />
        <Route name="dashboard" path="/dashboard" handler={Dashboard} />
        <Route name="forgot-password" path="/forgotPassword" handler={Dashboard} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

