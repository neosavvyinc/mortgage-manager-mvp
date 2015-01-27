var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Welcome = require('../views/view-welcome');
var Dashboard = require('../views/dashboard/view-dashboard');
var Modal = require('../components/modal');
var NewPassword = require('../views/registration/view-new-password');
var ApplicantInfo = require('../views/registration/view-applicant-info');
var LenderInfo = require('../views/registration/view-lender-info');
var ApplicantQuestions = require('../views/registration/view-questions');
var Applications = require('../views/dashboard/view-application-list');
var Documents = require('../views/dashboard/view-document-list');
var Upload = require('../views/dashboard/view-upload-document');
var viewPdf = require('../views/dashboard/view-pdf-document');

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
                <h1>To Be Implemented...</h1>
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
            <Route name="lenderInfo" path="lender-info" handler={LenderInfo} />
            <Route name="applicantInfo" path="applicant-info" handler={ApplicantInfo} />
        </Route>
        <Route name="dashboard" handler={Dashboard}>
            <Route name="dashboardApplications" path="applications" handler={Applications} />
            <Route name="dashboardDocuments" path="applications/:appId" handler={Documents}>
                <Route name="uploadNewDocument" handler={Modal}>
                    <DefaultRoute handler={Upload} />
                </Route>
                <Route name="uploadExistingDocument" path="document/:documentId/upload" handler={Modal}>
                    <DefaultRoute handler={Upload} />
                </Route>
                <Route name="viewDocument" path="document/:documentId/" handler={Modal}>
                    <DefaultRoute handler={viewPdf} />
                </Route>
            </Route>
            <Route name="routeTester" path="testRoute" handler={TestRoute1} />
        </Route>
        <Route name="forgotPassword" path="forgot-password" handler={TestRoute1} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

