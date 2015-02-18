var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../models/model-application');
var ApplicationActions = require('../../actions/action-application');
var ApplicationStore = require('../../stores/store-application');
var UserStore = require('../../stores/store-user');
var Navigation = require('../../components/navigation');

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
        Reflux.listenTo(ApplicationStore, "reloadLenders")
    ],

    getInitialState: function(){
        return {
            lenders: [],
            actionError: false,
            actionErrorMessage: ''
        };
    },

    componentDidMount: function(){
       if(this.isMounted()){
           this.getLenders();
       }
    },

    componentDidUpdate: function(prevProps, prevState) {
	    if (prevState.lenders.length>0 && arraysEqual(prevState.lenders, this.state.lenders)) {
            this.getLenders();
        }
    },

    getLenders: function(){
        Application.getLenders(this.getParams().appId).then(function(lenders){
            this.setState({
                lenders: lenders
            });
        }.bind(this));
    },

    reloadLenders: function(){
        this.getLenders();
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
            this.reloadLenders();
        }.bind(this), function(error){
            this.setState({
                actionError: true,
                actionErrorMessage: error.responseJSON.message
            });
        }.bind(this));
    },

    render: function(){
        var lendersTable = [];

        var actions = [
            {
                tabName: "Invite Lender",
                tabLink: {
                    name: "inviteLender",
                    params: [{
                        appId: this.getParams().appId
                    }]
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

            if(lender.status === 'Pending'){
                actionBtns = (
                    <th>
                        <div className="row">
                            <button className="btn turquoise mobile gap-right tooltip" data-tooltip="Remind" onClick={this.onReSendInvite.bind(null, lender)}><i className="fa fa-paper-plane"></i></button>
                            <button className="btn red mobile tooltip" data-tooltip="Delete" onClick={this.onDeleteInvite.bind(null, lender)}><i className="fa fa-trash-o"></i></button>
                        </div>
                    </th>
                )
            } else {
                actionBtns = (
                    <th>
                        <div className="row">
                            <a href={mailTo}><button className="btn blue mobile gap-right tooltip" data-tooltip="Email"><i className="fa fa-envelope-o"></i></button></a>
                            <a href={callTo}><button className="btn green mobile tooltip" data-tooltip="Call"><i className="fa fa-phone"></i></button></a>
                        </div>
                    </th>
                );
            }
            lendersTable.push((
                <tr>
                    <th>{lender.firstName + " " + lender.lastName}</th>
                    <th>{lender.organization}</th>
                    <th>{lender.email}</th>
                    <th>{lender.status}</th>
                {actionBtns}
                </tr>
            ));
        }, this);

        return (
            <div className="container">
                <div className="gap-top">
                    <h2>Lenders</h2>
                    <Navigation navigationItems={actions}/>
                    <table className="responsive">
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
