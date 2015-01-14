var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');

var BorrowerStore = require('../../stores/store-borrower');
var BorrowerActions = require('../../actions/action-borrower');

var User = require('../../models/model-user');

var ErrorMessage = require('../../components/component-error-msg');

var ApplicantQuestions = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(BorrowerStore, 'onContinue')
    ],

    statics: {
        willTransitionTo: function (transition){
            if(!BorrowerStore.getBorrower().email && !BorrowerStore.getBorrower().password){
                transition.redirect('welcome');
            }
        }
    },

    getInitialState: function(){
        return {
            hasCoapplicant: false,
            isSelfEmployed: false,
            questionsError: false,
            errorText: ""
        }
    },

    render: function(){

        var coapplicantYes = this.state.hasCoapplicant ? "one fifth blue button" : "one fifth";
        var coapplicantNo = this.state.hasCoapplicant ? "one fifth" : "one fifth blue button";
        var selfEmployedYes = this.state.isSelfEmployed ? "one fifth blue button" : "one fifth";
        var selfEMployedNo = this.state.isSelfEmployed ? "one fifth" : "one fifth blue button";

        return (
            <div>
                <h1>We have to ask you a few questions to get this right</h1>
                <h3 className="row">Do you have a co-applicant like a spouse or partner?</h3>
                <div className="row gap-bottom">
                    <button className={coapplicantYes} onClick={this.onCoapplicantChange.bind(this, true)}>Yes</button>
                    <button className={coapplicantNo} onClick={this.onCoapplicantChange.bind(this, false)}>No</button>
                </div>
                <h3 className="row">Are you Self Employed?</h3>
                <div className="row gap-bottom">
                    <button className={selfEmployedYes} onClick={this.onSelfEmployedChange.bind(this, true)}>Yes</button>
                    <button className={selfEMployedNo} onClick={this.onSelfEmployedChange.bind(this, false)}>No</button>
                </div>
                <ErrorMessage errorDisplay={this.state.questionsError} errorMessage={this.state.errorText}/>
                <button className="row blue button" onClick={this.onSubmitQuestions}>Continue</button>
            </div>
        );
    },

    onCoapplicantChange: function(status){
        this.setState({hasCoapplicant: status});
    },
    onSelfEmployedChange: function(status){
        this.setState({isSelfEmployed: status});
    },

    onSubmitQuestions: function(){
        User.update({
            isSelfEmployed: this.state.isSelfEmployed
        }).then(function(){
            BorrowerActions.submitQuestions(this.state.hasCoapplicant, this.state.isSelfEmployed);
        }.bind(this), function(error){
            this.setState({
                questionsError: true,
                errorText: error.message
            });
        }.bind(this));
    },

    onContinue: function(){
        this.transitionTo('applicantInfo');
    }
});

module.exports = ApplicantQuestions;
