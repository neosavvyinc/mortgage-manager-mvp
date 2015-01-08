var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Main = require('../pages/main');
var Dashboard = require('../pages/dashboard');

/* Default Root Handler */
var RootDefault = React.createClass({
    mixins: [Router.State],
    render: function(){
        return (
            <RouterHandler />
        )
    }
});

/* Test Handler */
var TestHandler = React.createClass({
    render: function(){
        return (
            <h4 className="col-md-8">Roy Batty: I have… seen things you people wouldnt believe… Attack ships on fire off the shoulder of Orion. I watched c-beams glitter in the dark near the Tannhäuser Gate. All those… moments… will be lost in time, like [small cough] tears… in… rain. Time… to die…</h4>
        )
    }
});

var routes = (
    <Route name="root" path="/" handler={RootDefault}>
        <DefaultRoute name="main" handler={Main} />
        <Route path="/dashboard" handler={Dashboard}>
            <Route name="test" path="/test" handler={TestHandler} />
        </Route>
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

