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
var LenderInfo = require('../views/registration/view-lender-info');
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

var TestRoute1 = React.createClass({
    mixins: [Router.State],
    render: function(){
        return (
            <div className="container">
                <h1>Something really important...</h1>
            </div>
        )
    }
});
var TestRoute2 = React.createClass({
    mixins: [Router.State],
    render: function(){
        return (
            <div className="container">
                <h1>Something not that important...</h1>
            </div>
        )
    }
});
var TestRoute3 = React.createClass({
    mixins: [Router.State],
    render: function(){
        return (
            <div className="container">
                <h1>Something extremely important!!</h1>
            </div>
        )
    }
});

var routes = (
    <Route handler={RootDefault}>
        <DefaultRoute name="welcome" handler={Welcome} />
        <Route name="register" handler={RootDefault}>
            <Route name="newPassword" path="/register/newPassword" handler={NewPassword}/>
            <Route name="applicantQuestions" path="/register/applicantQuestions" handler={ApplicantQuestions} />
            <Route name="lenderInfo" path="/register/lenderInfo" handler={LenderInfo} />
            <Route name="applicantInfo" path="/register/applicantInfo" handler={ApplicantInfo} />
        </Route>
        <Route name="dashboard" handler={Dashboard}>
            <DefaultRoute name="dashboardMain" handler={TestRoute1} />
            <Route name="dashboardApplicants" path="applicants" handler={TestRoute2} />
            <Route name="dashboardDocuments" path="documents" handler={TestRoute3} />
        </Route>
        <Route name="forgotPassword" path="forgot-password" handler={TestRoute1} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

