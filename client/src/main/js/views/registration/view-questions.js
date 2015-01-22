var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');
var UserStore = require('../../stores/store-user');

var User = require('../../models/model-user');

var ErrorMessage = require('../../components/error-message');

var ApplicantQuestions = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(BorrowerStore, 'onContinue')
    ],

    statics: {
        willTransitionTo: function (transition){
            if(!UserStore.isAuthenticated()){
                transition.redirect('welcome');
            }
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

        var coapplicantYes = this.state.hasCoapplicant ? "two fifths turquoise button half-gap-right" : "two fifths half-gap-right";
        var coapplicantNo = this.state.hasCoapplicant ? "two fifths half-gap-right" : "two fifths turquoise button half-gap-right";
        var selfEmployedYes = this.state.isSelfEmployed ? "two fifths turquoise button half-gap-right" : "two fifths half-gap-right";
        var selfEMployedNo = this.state.isSelfEmployed ? "two fifths half-gap-right" : "two fifths turquoise button half-gap-right";
        var recentlyMarriedYes = this.state.recentlyMarried ? "two fifths turquoise button half-gap-right" : "two fifths half-gap-right";
        var recentlyMarriedNo = this.state.recentlyMarried ? "two fifths half-gap-right" : "two fifths turquoise button half-gap-right";
        var rentingYes = this.state.renting ? "two fifths turquoise button half-gap-right" : "two fifths half-gap-right";
        var rentingNo = this.state.renting ? "two fifths half-gap-right" : "two fifths turquoise button half-gap-right";
        var financialAssetsYes = this.state.hasFinancialAssets ? "two fifths turquoise button half-gap-right" : "two fifths half-gap-right";
        var financialAssetsNo = this.state.hasFinancialAssets ? "two fifths half-gap-right" : "two fifths turquoise button half-gap-right";

        return (
            <div className="container">
                <div className="gap-top">
                    <h1>We have to ask you a few questions to get this right</h1>
                    <div className="row">
                        <h3 className="row">Do you have a co-applicant like a spouse or partner?</h3>
                        <div className="one fourth row gap-bottom">
                            <button className={coapplicantYes} onClick={this.onCoapplicantChange.bind(this, true)}>Yes</button>
                            <button className={coapplicantNo} onClick={this.onCoapplicantChange.bind(this, false)}>No</button>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="row">Are you Self Employed?</h3>
                        <div className="row one fourth gap-bottom">
                            <button className={selfEmployedYes} onClick={this.onSelfEmployedChange.bind(this, true)}>Yes</button>
                            <button className={selfEMployedNo} onClick={this.onSelfEmployedChange.bind(this, false)}>No</button>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="row">Have you recently gotten married?</h3>
                        <div className="row one fourth gap-bottom">
                            <button className={recentlyMarriedYes} onClick={this.onMarried.bind(this, true)}>Yes</button>
                            <button className={recentlyMarriedNo} onClick={this.onMarried.bind(this, false)}>No</button>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="row">Have you been renting an apartment until now?</h3>
                        <div className="row one fourth gap-bottom">
                            <button className={rentingYes} onClick={this.onRenting.bind(this, true)}>Yes</button>
                            <button className={rentingNo} onClick={this.onRenting.bind(this, false)}>No</button>
                        </div>
                    </div>
                    <div className="row">
                        <h3 className="row">Do you Have a SEP-IRA / 401k?</h3>
                        <div className="row one fourth gap-bottom">
                            <button className={financialAssetsYes} onClick={this.onFinancialAssets.bind(this, true)}>Yes</button>
                            <button className={financialAssetsNo} onClick={this.onFinancialAssets.bind(this, false)}>No</button>
                        </div>
                    </div>
                    <div className="one fourth row">
                        <ErrorMessage errorDisplay={this.state.questionsError} errorMessage={this.state.errorText}/>
                        <button className="row block turquoise" onClick={this.onSubmitQuestions}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ApplicantQuestions;
