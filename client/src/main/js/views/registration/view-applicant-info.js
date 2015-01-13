var React = require('react');
var Router = require('react-router');

var BorrowerStore = require('../../stores/store-borrower');

/* Components */
var ApplicantBasic = require('../../components/component-applicant-basic');

/* View */

var ApplicantInfo = React.createClass({

    mixins: [Router.State],

    statics: {
        willTransitionTo: function (transition){
            if(!BorrowerStore.getBorrower().email){
                transition.redirect('welcome');
            }
        }
    },

    getInitialState: function(){
        return {
            currentBorrower: BorrowerStore.getBorrower()
        }
    },

    render: function(){
        return (
            <ApplicantBasic applicantType={this.state.currentBorrower.type} />
        );
    }
});

module.exports = ApplicantInfo;
