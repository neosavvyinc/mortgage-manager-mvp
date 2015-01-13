var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Welcome = require('../views/view-welcome');
var Dashboard = require('../views/view-dashboard');
var NewPassword = require('../views/registration/view-new-password');
var ApplicantInfo = require('../views/registration/view-applicant-info');
var ApplicantQuestions = require('../views/registration/view-questions');

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
        <DefaultRoute name="welcome" handler={Welcome} />
        <Route name="register" handler={RootDefault}>
            <Route name="newPassword" path="/register/newPassword" handler={NewPassword}/>
            <Route name="applicantQuestions" path="/register/applicantQuestions" handler={ApplicantQuestions} />
            <Route name="applicantInfo" path="/register/applicantInfo" handler={ApplicantInfo} />
        </Route>
        <Route name="dashboard" handler={Dashboard} />
        <Route name="forgot-password" handler={Dashboard} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

