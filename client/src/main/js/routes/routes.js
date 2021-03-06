var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouterHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

/* Pages */
var Welcome = require('../views/view-welcome');
var Contact = require('../views/view-contact');
var FAQ = require('../views/view-faq');
var Legal = require('../views/view-legal');
var Pricing = require('../views/view-pricing');
var Team = require('../views/view-team');
var Dashboard = require('../views/dashboard/view-dashboard');
var Modal = require('../components/modal');
var Register = require('../views/registration/view-register');
var NewPassword = require('../views/registration/view-new-password');
var UpdatePassword = require('../views/registration/view-update-password');
var ChangePassword = require('../views/dashboard/settings/view-change-password');
var ApplicantInfo = require('../views/registration/view-applicant-info');
var CoApplicantInfo = require('../views/registration/view-coapplicant-info');
var LenderInfo = require('../views/registration/view-lender-info');
var ApplicantQuestions = require('../views/registration/view-questions');
var newLenderInvite = require('../views/registration/view-new-lender-invite');
var Applications = require('../views/dashboard/common/view-application-list');
var Documents = require('../views/dashboard/common/view-document-list');
var Upload = require('../views/dashboard/modals/borrower/view-upload-document');
var viewPdf = require('../views/dashboard/modals/view-pdf-document');
var InviteLender = require('../views/dashboard/modals/borrower/view-invite-lender');
var ApplicationDetails = require('../views/dashboard/common/view-application-details');
var RequestDocument = require('../views/dashboard/modals/lender/view-lender-request-document');
var ForgotPassword = require('../views/registration/view-forgot-password');
var ViewProfile = require('../views/dashboard/settings/view-update-profile');
var addCoapplicant = require('../views/dashboard/modals/borrower/view-add-coapplicant');
var PricingOptions = require('../views/dashboard/payment/view-pricing-options');
var StripePayment = require('../views/dashboard/payment/view-stripe-payment');
var TrialExpired = require('../views/dashboard/modals/borrower/view-trial-expired');
var PaymentSuccess = require('../views/dashboard/modals/borrower/view-payment-success');

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
        <Route name="register" handler={Register}>
            <Route name="newPassword" path="new-password" handler={NewPassword}/>
            <Route name="updatePassword" path="update-password" handler={UpdatePassword}/>
            <Route name="applicantQuestions" path="applicant-questions" handler={ApplicantQuestions} />
            <Route name="lenderInfo" path="lender-info" handler={LenderInfo} />
            <Route name="applicantInfo" path="applicant-info" handler={ApplicantInfo} />
            <Route name="coApplicantInfo" path="coapplicant-info" handler={CoApplicantInfo} />
            <Route name="newLender" path="new-lender" handler={newLenderInvite} />
        </Route>
        <Route name="dashboard" handler={Dashboard}>
	        <Route name="trialExpired" path="trial-expired" handler={Modal}>
		        <DefaultRoute handler={TrialExpired}/>
	        </Route>
	        <Route name="paymentSuccess" path="payment-success" handler={Modal}>
		        <DefaultRoute handler={PaymentSuccess}/>
	        </Route>
	        <Route name="changePassword" path="change-password" handler={ChangePassword}/>
	        <Route name="viewProfile" path="view-profile" handler={ViewProfile}>
                <Route name="addCoapplicant" path="add-coapplicant" handler={Modal}>
                    <DefaultRoute handler={addCoapplicant} />
                </Route>
            </Route>
            <Route name="dashboardApplications" path="applications" handler={Applications} />
            <Route name="dashboardAppDetails" path="applications/:appId/:tabName" handler={ApplicationDetails}>
                <Route name="uploadNewDocument" path="upload" handler={Modal}>
                    <DefaultRoute handler={Upload} />
                </Route>
                <Route name="uploadExistingDocument" path="document/:documentId/upload" handler={Modal}>
                    <DefaultRoute handler={Upload} />
                </Route>
                <Route name="viewDocument" path="document/:documentId/" handler={Modal}>
                    <DefaultRoute handler={viewPdf} />
                </Route>
                <Route name="inviteLender" path="invite-lender" handler={Modal}>
                    <DefaultRoute handler={InviteLender} />
                </Route>
                <Route name="requestDocument" path="lender/document-request/:docType" handler={Modal}>
                    <DefaultRoute handler={RequestDocument}/>
                </Route>
            </Route>
            <Route name="routeTester" path="testRoute" handler={TestRoute1} />
	        <Route name="pricingOptions" path="pricing-options" handler={PricingOptions}/>
	        <Route name="stripePayment" path="stripe-payment/:price" handler={StripePayment}/>
        </Route>
        <Route name="forgotPassword" path="forgot-password" handler={ForgotPassword} />
        <Route name="pricing" handler={Pricing} />
        <Route name="faq" handler={FAQ} />
        <Route name="team" handler={Team} />
        <Route name="legal" handler={Legal} />
        <Route name="contact" handler={Contact} />
    </Route>
);

var router = Router.create({
    routes: routes
});

module.exports = router;

