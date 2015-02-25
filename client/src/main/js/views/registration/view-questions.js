var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');
var UserStore = require('../../stores/store-user');

var User = require('../../models/model-user');

var MessageBox = require('../../components/message-box');

var ApplicantQuestions = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(BorrowerStore, 'onContinue')
    ],

    statics: {
        willTransitionTo: function (transition){
            transition.wait(
                User.isAuthenticated().then(function (res) {
                    if (!res.isAuthenticated) {
                        transition.redirect('welcome');
                    }
                })
            );
        }
    },

    getInitialState: function(){
        return {
            hasCoapplicant: false,
            isSelfEmployed: false,
            recentlyMarried: false,
            renting: false,
            hasFinancialAssets: false,
            questionsError: false,
            errorText: ""
        }
    },

    onCoapplicantChange: function(status){
        this.setState({hasCoapplicant: status});
    },

    onSelfEmployedChange: function(status){
        this.setState({isSelfEmployed: status});
    },

    onMarried: function(status){
        this.setState({recentlyMarried: status});
    },

    onRenting: function(status){
        this.setState({renting: status});
    },

    onFinancialAssets: function(status){
        this.setState({hasFinancialAssets: status});
    },

    onSubmitQuestions: function(){
        BorrowerActions.submitQuestions(
            this.state.hasCoapplicant,
            this.state.isSelfEmployed,
            this.state.recentlyMarried,
            this.state.renting,
            this.state.hasFinancialAssets
        );
    },

    onContinue: function(){
        this.transitionTo('applicantInfo');
    },

    render: function(){

        var coapplicantYes = this.state.hasCoapplicant ? "btn btn-md btn-light-blue col-sm-6 col-xs-12" : "btn btn-md btn-default col-sm-6 col-xs-12";
        var coapplicantNo = this.state.hasCoapplicant ? "btn btn-md btn-default col-sm-6 col-xs-12" : "btn btn-md btn-light-blue col-sm-6 col-xs-12";
        var selfEmployedYes = this.state.isSelfEmployed ? "btn btn-md btn-light-blue col-sm-6 col-xs-12" : "btn btn-md btn-default col-sm-6 col-xs-12";
        var selfEMployedNo = this.state.isSelfEmployed ? "btn btn-md btn-default col-sm-6 col-xs-12" : "btn btn-md btn-light-blue col-sm-6 col-xs-12";
        var recentlyMarriedYes = this.state.recentlyMarried ? "btn btn-md btn-light-blue col-sm-6 col-xs-12" : "btn btn-md btn-default col-sm-6 col-xs-12";
        var recentlyMarriedNo = this.state.recentlyMarried ? "btn btn-md btn-default col-sm-6 col-xs-12" : "btn btn-md btn-light-blue col-sm-6 col-xs-12";
        var rentingYes = this.state.renting ? "btn btn-md btn-light-blue col-sm-6 col-xs-12" : "btn btn-md btn-default col-sm-6 col-xs-12";
        var rentingNo = this.state.renting ? "btn btn-md btn-default col-sm-6 col-xs-12" : "btn btn-md btn-light-blue col-sm-6 col-xs-12";
        var financialAssetsYes = this.state.hasFinancialAssets ? "btn btn-md btn-light-blue col-sm-6 col-xs-12" : "btn btn-md btn-default col-sm-6 col-xs-12";
        var financialAssetsNo = this.state.hasFinancialAssets ? "btn btn-md btn-default col-sm-6 col-xs-12" : "btn btn-md btn-light-blue col-sm-6 col-xs-12";

        return (
            <div className="container">
                <div className="row">
                    <h1 className="col-xs-12 bordered-bottom">We have to ask you a few questions to get this right</h1>
                </div>
                <div className="row triple-gap-bottom">
                    <div className="row">
                        <h3 className="col-xs-12 text-center gap-bottom">Do you have a co-applicant like a spouse or partner?</h3>
                        <div className="row text-center gap-bottom">
                            <div className="col-sm-6 col-sm-offset-3 col-xs-12">
                                <button className={coapplicantYes} onClick={this.onCoapplicantChange.bind(this, true)}>Yes</button>
                                <button className={coapplicantNo} onClick={this.onCoapplicantChange.bind(this, false)}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="col-xs-12 text-center gap-bottom">Are you Self Employed?</h3>
                        <div className="row text-center gap-bottom">
                            <div className="col-sm-6 col-sm-offset-3 col-xs-12">
                                <button className={selfEmployedYes} onClick={this.onSelfEmployedChange.bind(this, true)}>Yes</button>
                                <button className={selfEMployedNo} onClick={this.onSelfEmployedChange.bind(this, false)}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="col-xs-12 text-center gap-bottom">Have you recently gotten married?</h3>
                        <div className="row text-center gap-bottom">
                            <div className="col-sm-6 col-sm-offset-3 col-xs-12">
                                <button className={recentlyMarriedYes} onClick={this.onMarried.bind(this, true)}>Yes</button>
                                <button className={recentlyMarriedNo} onClick={this.onMarried.bind(this, false)}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="col-xs-12 text-center gap-bottom">Have you been renting an apartment until now?</h3>
                        <div className="row text-center gap-bottom">
                            <div className="col-sm-6 col-sm-offset-3 col-xs-12">
                                <button className={rentingYes} onClick={this.onRenting.bind(this, true)}>Yes</button>
                                <button className={rentingNo} onClick={this.onRenting.bind(this, false)}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="col-xs-12 text-center gap-bottom">Do you have a retirement plan?</h3>
                        <div className="row text-center gap-bottom">
                            <div className="col-sm-6 col-sm-offset-3 col-xs-12">
                                <button className={financialAssetsYes} onClick={this.onFinancialAssets.bind(this, true)}>Yes</button>
                                <button className={financialAssetsNo} onClick={this.onFinancialAssets.bind(this, false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4 col-xs-12">
                        <div className="row">
                            <MessageBox displayMessage={this.state.questionsError} message={this.state.errorText} type='error' />
                        </div>
                        <div className="row">
                            <button className="btn btn-md btn-dark-blue col-xs-12" onClick={this.onSubmitQuestions}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ApplicantQuestions;
