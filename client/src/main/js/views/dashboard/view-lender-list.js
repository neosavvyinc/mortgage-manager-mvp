var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../models/model-application');
var ApplicationActions = require('../../actions/action-application');
var ApplicationStore = require('../../stores/store-application');
var UserStore = require('../../stores/store-user');
var User = require('../../models/model-user');
var Navigation = require('../../components/navigation');
var LenderStore = require('../../stores/store-lender');
var LenderActions = require('../../actions/action-lender');

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length){
        return false;
    }
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

var LenderContacts = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation,
        Reflux.listenTo(LenderStore, "getLenders")
    ],

    getInitialState: function(){
        return {
            lenders: LenderStore.getLenderList(),
            actionError: false,
            actionErrorMessage: '',
	        disableButtons: false
        };
    },
	
    componentDidMount: function() {
	    if(this.isMounted()) {
		    Application.getLenders(this.getParams().appId).then(function (lenders) {
			    LenderActions.setLenderList(lenders);
		    }.bind(this));
	    }
    },

    getLenders: function(){
	    User.getUserDetails(UserStore.getCurrentUserId()).then(function (user) {
		    var createdDate = moment(user.created),
			    currentDate = moment(),
			    duration = moment.duration(currentDate.diff(createdDate)),
			    state={lenders: LenderStore.getLenderList()};

		    if (user.type === 'borrower' && user.pricingPlan === 'trial' && duration.asDays() > 15) {
			    state.disableButtons = true;
		    }
		    this.setState(state);
	    }.bind(this));
    },

    onReSendInvite: function(lender){
        Application.reSendInvite(this.getParams().appId, lender).then(function(){
            // TODO: NOT NEED. A message should be displayed
            ApplicationActions.reSendInvite();
        }.bind(this), function(error){
            this.setState({
                actionError: true,
                actionErrorMessage: error.responseJSON.message
            });
        }.bind(this));
    },

    onDeleteInvite: function(lender){
        Application.deleteInvite(this.getParams().appId, lender).then(function(){
            LenderActions.removeLenderInvite(lender);
        }.bind(this), function(error){
            this.setState({
                actionError: true,
                actionErrorMessage: error.responseJSON.message
            });
        }.bind(this));
    },

    render: function(){
        var lendersTable = [],
	        remindButton = {
		    disabled: false
	    }, lenderInviteDisabled = false;

	    if(this.state.disableButtons) {
		    lenderInviteDisabled = true;
		    remindButton.disabled = true;
	    }

        var actions = [
            {
                tabName: "Invite Lender",
                tabLink: {
                    name: "inviteLender",
                    params: [{
                        appId: this.getParams().appId,
                        tabName: 'lenders'
                    }],
	                disabled: lenderInviteDisabled
                },
	            icon: 'fa fa-user-plus'
            }
        ];

	    var actionStyle = {
		    width: '16%'
	    }, statusColStyle = {
			width: '16%'
	    }, orgColStyle ={
		    width: '16%'
	    }, otherColStyle ={
	        width: '26%'
	    };

        _.forEach(this.state.lenders, function(lender){

            var actionBtns,
                mailTo = "mailto:" + lender.email,
                callTo = "tel:" + lender.phone;

            if(lender.status !== 'Accepted'){
                actionBtns = (
                    <th>
                        <div className="row">
                            <ul className="list-inline">
                                <li className="btn-group">
                                    <button className="btn btn-sm btn-info" disabled={remindButton.disabled} data-tooltip="Remind" onClick={this.onReSendInvite.bind(null, lender)}><i className="fa fa-paper-plane"></i></button>
                                </li>
                                <li className="btn-group">
                                    <button className="btn btn-sm btn-danger" data-tooltip="Delete" onClick={this.onDeleteInvite.bind(null, lender)}><i className="fa fa-trash-o"></i></button>
                                </li>
                            </ul>
                        </div>
                    </th>
                )
            } else {
                actionBtns = (
                    <th>
                        <div className="row">
                            <ul className="list-inline">
                                <li className="btn-group">
                                    <a href={mailTo}><button className="btn btn-sm btn-primary" data-tooltip="Email"><i className="fa fa-envelope-o"></i></button></a>
                                </li>
                                <li className="btn-group">
                                    <a href={callTo}><button className="btn btn-sm btn-success" data-tooltip="Call"><i className="fa fa-phone"></i></button></a>
                                </li>
                            </ul>
                        </div>
                    </th>
                );
            }
            lendersTable.push((
                <tr>
                    <th>{lender.firstName + " " + lender.lastName}</th>
                    <th>{lender.organization}</th>
                    <th>{lender.email}</th>
                    <th>{lender.status || "Pending"}</th>
                {actionBtns}
                </tr>
            ));
        }, this);

        return (
            <div className="gap-top">
                <h2>Lenders</h2>
                <Navigation navigationItems={actions}/>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <col style={otherColStyle}/>
                        <col style={orgColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={statusColStyle}/>
                        <col style={actionStyle}/>
                        <thead>
                            <tr>
                                <th>Lender Name</th>
                                <th>Organization</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                    {lendersTable.map(function(lender) {
                        return (lender);
                    })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = LenderContacts;
