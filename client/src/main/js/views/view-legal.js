var React = require('react');

var HeaderLogout = require('../components/header-logout'),
    Footer = require('../components/footer');


var Legal = React.createClass({
    render: function(){
        return (
            <span>
                <div className="fill">
                    <div className="header">
                        <HeaderLogout />
                    </div>
                    <div className="content-body">
                        <div className=" container">
                            <div className="panel panel-default bg-white">
                                <div className="panel-body no-pad-bottom">
                                    <div className="row">
                                        <h2 className="bordered-bottom col-xs-12">DocSwap Terms of Service</h2>
                                    </div>
                                    <div className="row">
                                        <h4 className="bordered-bottom col-xs-12">Posted: April 14, 2015</h4>
                                    </div>
                                    <div className="row triple-gap-bottom double-gap-top">
                                        <p className="col-xs-12">
                                            Thanks for using DocSwap! These terms of service ("Terms") cover your use and access to the services,
                                            client software and websites ("Services") provided by DocSwap and Neosavvy, Inc. Our Privacy Policy
                                            explains how we collect and use your information while our Acceptable Use Policy outlines your
                                            responsibilities when using our Services. By using our Services, you're agreeing to be bound by these
                                            Terms, and to review our Privacy and Acceptable Use policies. If you're using our Services for an
                                            organization, you're agreeing to these Terms on behalf of that organization.
                                        </p>
                                        <p className="col-xs-12">
                                            Your Stuff &amp; Your Permissions
                                            When you use our Services, you provide us with things like your files, content, email messages,
                                            contacts and so on ("Your Stuff"). Your Stuff is yours. These Terms don't give us any rights to
                                            Your Stuff except for the limited rights that enable us to offer the Services.
                                        </p>
                                        <p className="col-xs-12">

                                            We need your permission to do things like hosting Your Stuff, backing it up, and sharing it when
                                            you ask us to. Our Services also provide you with features like document previews, email organization,
                                            easy sorting, sharing with lenders and borrowers. These and other features may require our systems
                                            to access, store and scan Your Stuff. You give us permission to do those things, and this permission
                                            extends to trusted third parties we work with.
                                        </p>
                                        <p className="col-xs-12">

                                            Sharing Your Stuff
                                            Our Services let you share Your Stuff with others, so please think carefully about what you share
                                            and more importantly whom you are sharing with.
                                        </p>
                                        <p className="col-xs-12">

                                            Your Responsibilities
                                            You're responsible for your conduct, Your Stuff and you must comply with our Acceptable Use Policy.
                                            Content in the Services may be protected by others' intellectual property rights. Please don't copy,
                                            upload, download or share content unless you have the right to do so.
                                        </p>
                                        <p className="col-xs-12">

                                            We may review your conduct and content for compliance with these Terms and our Acceptable Use Policy.
                                            With that said, we have no obligation to do so. We aren't responsible for the content people post
                                            and share via the Services.
                                        </p>
                                        <p className="col-xs-12">

                                            Please safeguard your password to the Services, make sure that others don't have access to it,
                                            and keep your account information current.
                                        </p>
                                        <p className="col-xs-12">

                                            Finally, our Services are not intended for and may not be used by people under the age of 13.
                                            By using our Services, you are representing to us that you're over 13.
                                        </p>
                                        <p className="col-xs-12">

                                            Software
                                            Some of our Services allow you to download client software ("Software") which may update automatically.
                                            So long as you comply with these Terms, we give you a limited, nonexclusive, nontransferable,
                                            revocable license to use the Software, solely to access the Services. To the extent any component
                                            of the Software may be offered under an open source license, we'll make that license available to
                                            you and the provisions of that license may expressly override some of these Terms. Unless the following
                                            restrictions are prohibited by law, you agree not to reverse engineer or decompile the Services,
                                            attempt to do so, or assist anyone in doing so.
                                        </p>
                                        <p className="col-xs-12">

                                            Our Stuff
                                            The Services are protected by copyright, trademark, and other US and foreign laws. These Terms don't
                                            grant you any right, title or interest in the Services, others' content in the Services, DocSwap
                                            trademarks, logos and other brand features. We welcome feedback, but note that we may use comments
                                            or suggestions without any obligation to you.
                                        </p>
                                        <p className="col-xs-12">

                                            Copyright
                                            We respect the intellectual property of others and ask that you do too. We respond to notices of
                                            alleged copyright infringement if they comply with the law, and such notices should be reported
                                            using our DMCA Process. We reserve the right to delete or disable content alleged to be infringing
                                            and terminate accounts of repeat infringers. Our designated agent for notice of alleged copyright
                                            infringement on the Services is:

                                            Copyright Agent
                                            DocSwap, Inc.
                                            349 5th Ave, Suite 349
                                            New York, NY 10016
                                            adam@docswap.co

                                        </p>
                                        <p className="col-xs-12">

                                            Paid Accounts
                                            Billing. You can increase your storage space and add paid features to your account (turning your
                                            account into a "Paid Account"). We'll automatically bill you from the date you convert to a Paid
                                            Account and on each periodic renewal until cancellation. You're responsible for all applicable taxes,
                                            and we'll charge tax when required to do so.
                                        </p>
                                        <p className="col-xs-12">

                                            No Refunds. You may cancel your DocSwap Paid Account at any time but you won't be issued a refund
                                            unless it's legally required.
                                        </p>
                                        <p className="col-xs-12">

                                            Downgrades. Your Paid Account will remain in effect until it's cancelled or terminated under these
                                            Terms. If you don't pay for your Paid Account on time, we reserve the right to suspend it or reduce
                                            your storage to free space levels.
                                        </p>
                                        <p className="col-xs-12">
                                            Changes. We may change the fees in effect but will give you advance notice of these changes via a
                                            message to the email address associated with your account.
                                        </p>
                                        <p className="col-xs-12">
                                            Termination
                                            You're free to stop using our Services at any time. We also reserve the right to suspend or end the
                                            Services at any time at our discretion and without notice. For example, we may suspend or terminate
                                            your use of the Services if you're not complying with these Terms, or use the Services in a manner
                                            that would cause us legal liability, disrupt the Services or disrupt others' use of the Services.
                                            Except for Paid Accounts, we reserve the right to terminate and delete your account if you haven't
                                            accessed our Services for 12 consecutive months. We'll of course provide you with notice via the
                                            email address associated with your account before we do so.
                                        </p>
                                        <p className="col-xs-12">
                                            Services "AS IS"
                                            We strive to provide great Services, but there are certain things that we can't guarantee.
                                            TO THE FULLEST EXTENT PERMITTED BY LAW, DOCSWAP AND ITS AFFILIATES, SUPPLIERS AND DISTRIBUTORS MAKE
                                            NO WARRANTIES, EITHER EXPRESS OR IMPLIED, ABOUT THE SERVICES. THE SERVICES ARE PROVIDED "AS IS." WE
                                            ALSO DISCLAIM ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
                                            Some states don't allow the disclaimers in this paragraph, so they may not apply to you.
                                        </p>
                                        <p className="col-xs-12">
                                            Limitation of Liability
                                            TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL DOCSWAP, ITS AFFILIATES, SUPPLIERS OR
                                            DISTRIBUTORS BE LIABLE FOR (A) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL
                                            DAMAGES OR ANY LOSS OF USE, DATA, BUSINESS, OR PROFITS, REGARDLESS OF LEGAL THEORY, WHETHER OR NOT
                                            DOCSWAP HAS BEEN WARNED OF THE POSSIBILITY OF SUCH DAMAGES, AND EVEN IF A REMEDY FAILS OF ITS ESSENTIAL
                                            PURPOSE; (B) AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES MORE THAN THE GREATER OF $20
                                            OR THE AMOUNTS PAID BY YOU TO DOCSWAP FOR THE PAST 12 MONTHS OF THE SERVICES IN QUESTION.
                                            Some states don't allow the types of limitations in this paragraph, so they may not apply to you.
                                        </p>
                                        <p className="col-xs-12">
                                            Resolving Disputes
                                            Let's Try To Sort Things Out First. We want to address your concerns without needing a formal legal
                                            case. Before filing a claim against DocSwap, you agree to try to resolve the dispute informally by
                                            contacting adam@docswap.co. We'll try to resolve the dispute informally by contacting you via email.
                                            If a dispute is not resolved within 15 days of submission, you or DocSwap may bring a formal proceeding.
                                        </p>
                                        <p className="col-xs-12">
                                            We Both Agree To Arbitrate. You and DocSwap agree to resolve any claims relating to these Terms or
                                            the Services through final and binding arbitration, except as set forth under Exceptions to Agreement
                                            to Arbitrate below.
                                        </p>
                                        <p className="col-xs-12">
                                            Opt-out of Agreement to Arbitrate. You can decline this agreement to arbitrate by emailing adam@docswap.co and
                                            submitting the opt-out form within 30 days of first accepting these Terms.
                                        </p>
                                        <p className="col-xs-12">
                                            Arbitration Procedures. The American Arbitration Association (AAA) will administer the arbitration
                                            under its Commercial Arbitration Rules and the Supplementary Procedures for Consumer Related Disputes.
                                            The arbitration will be held in the United States county where you live or work, New York (NY), or
                                            any other location we agree to.
                                        </p>
                                        <p className="col-xs-12">
                                            Arbitration Fees and Incentives. The AAA rules will govern payment of all arbitration fees. DocSwap
                                            will pay all arbitration fees for claims less than $75,000. If you receive an arbitration award
                                            that is more favorable than any offer we make to resolve the claim, we will pay you $1,000 in
                                            addition to the award. DocSwap will not seek its attorneys' fees and costs in arbitration unless
                                            the arbitrator determines that your claim is frivolous.
                                        </p>
                                        <p className="col-xs-12">
                                            Exceptions to Agreement to Arbitrate. Either you or Dropbox may assert claims, if they qualify, in
                                            small claims court in New York (NY) or any United States county where you live or work. Either party
                                            may bring a lawsuit solely for injunctive relief to stop unauthorized use or abuse of the Services,
                                            or intellectual property infringement (for example, trademark, trade secret, copyright, or patent
                                            rights) without first engaging in arbitration or the informal dispute-resolution process described
                                            above.
                                        </p>
                                        <p className="col-xs-12">
                                            No Class Actions. You may only resolve disputes with us on an individual basis, and may not bring a
                                            claim as a plaintiff or a class member in a class, consolidated, or representative action. Class
                                            arbitrations, class actions, private attorney general actions, and consolidation with other
                                            arbitrations aren't allowed.
                                        </p>
                                        <p className="col-xs-12">
                                            Judicial forum for disputes. In the event that the agreement to arbitrate is found not to apply to
                                            you or your claim, you and DocSwap agree that any judicial proceeding (other than small claims actions)
                                            will be brought in the federal or state courts of New York (NY). Both you and Dropbox consent to
                                            venue and personal jurisdiction there.
                                        </p>
                                        <p className="col-xs-12">
                                            Controlling Law
                                            These Terms will be governed by New York State law except for its conflicts of laws principles.
                                        </p>
                                        <p className="col-xs-12">
                                            Entire Agreement
                                            These Terms constitute the entire agreement between you and DocSwap with respect to the subject matter
                                            of these Terms, and supersede and replace any other prior or contemporaneous agreements, or terms and
                                            conditions applicable to the subject matter of these Terms. These Terms create no third party
                                            beneficiary rights.
                                        </p>
                                        <p className="col-xs-12">
                                            Waiver, Severability &amp; Assignment
                                            DocSwap's failure to enforce a provision is not a waiver of its right to do so later. If a provision
                                            is found unenforceable, the remaining provisions of the Terms will remain in full effect and an
                                            enforceable term will be substituted reflecting our intent as closely as possible. You may not assign
                                            any of your rights under these Terms, and any such attempt will be void. DocSwap may assign its rights
                                            to any of its affiliates or subsidiaries, or to any successor in interest of any business associated
                                            with the Services.
                                        </p>
                                        <p className="col-xs-12">
                                            Modifications
                                            We may revise these Terms from time to time, and will always post the most current version on our
                                            website. If a revision meaningfully reduces your rights, we will notify you (by, for example, sending
                                            a message to the email address associated with your account, posting on our blog or on this page).
                                            By continuing to use or access the Services after the revisions come into effect, you agree to be
                                            bound by the revised Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="push" />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        );
    }
});

module.exports = Legal;
