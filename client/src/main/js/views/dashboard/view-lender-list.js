var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Application = require('../../models/model-application');
var ApplicationActions = require('../../actions/action-application');
var ApplicationStore = require('../../stores/store-application');
var UserStore = require('../../stores/store-user');
var Navigation = require('../../components/navigation');

var loadLenders = function(){
    Application.getLenders(this.getParams().appId).then(function(lenders){
        this.setState({
            lenders: lenders
        });
    }.bind(this));
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
        if(this.isMounted()) {
            loadLenders.bind(this)();
        }
    },

    reloadLenders: function(){
        loadLenders.bind(this)();
    },

    onReSendInvite: function(lender){
        Application.reSendInvite(this.getParams().appId, lender).then(function(){
            ApplicationActions.reSendInvite();
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
                }
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

            var actionBtns;

            if(lender.status === 'Pending'){
                actionBtns = (
                    <th>
                        <div className="row">
                            <button className="btn red one mobile" onClick={this.onReSendInvite.bind(null, lender)}> Remind <i className="fa fa-mail-reply"></i></button>
                        </div>
                    </th>
                )
            } else {
                actionBtns = (
                    <th>
                        <div className="row">
                            <button className="btn blue one mobile">&nbsp;Email&nbsp;&nbsp;<i className="fa fa-envelope-o"></i>&nbsp;</button>
                        </div>
                    </th>
                )
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
