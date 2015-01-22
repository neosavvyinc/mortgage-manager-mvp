var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Welcome = require('../views/view-welcome');
var Dashboard = require('..views/dashboard/view-dashboard');
var Modal = require('../components/component-modal');
var NewPassword = require('../views/registration/view-new-password');
var ApplicantInfo = require('../views/registration/view-applicant-info');
var ApplicantQuestions = require('../views/registration/view-questions');
var Upload = require('../views/dashboard/view-upload-document');

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
            <Route name="newPassword" path="new-password" handler={NewPassword}/>
            <Route name="applicantQuestions" path="applicant-questions" handler={ApplicantQuestions} />
            <Route name="applicantInfo" path="applicant-info" handler={ApplicantInfo} />
        </Route>
        <Route name="dashboard" handler={Dashboard}>
            <DefaultRoute name="dashboardMain" handler={TestRoute1} />
            <Route name="dashboardApplicants" path="applicants" handler={TestRoute2} />
            <Route name="dashboardDocuments" path="documents" handler={TestRoute3} />
            <Route name="upload" handler={Modal}>
                <DefaultRoute handler={Upload} />
            </Route>
        </Route>
        <Route name="forgotPassword" path="forgot-password" handler={TestRoute1} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

