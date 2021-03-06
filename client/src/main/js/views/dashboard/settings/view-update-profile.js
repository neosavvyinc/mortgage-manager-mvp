'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
    RouterHandle = Router.RouteHandler,
    Link = Router.Link,
	Constants = require('../../../constants/constants'),
	MessageBox = require('../../../components/message-box'),
	User = require('../../../models/model-user'),
	UserStore = require('../../../stores/store-user'),
    ApplicationActions = require('../../../actions/action-application'),
    ApplicationStore = require('../../../stores/store-application'),
	Location = Router.HistoryLocation;

var validateApplicantInfo = function(applicantInfo){
	return (applicantInfo.firstName && applicantInfo.firstName !== '' &&
		applicantInfo.lastName && applicantInfo.lastName !== '' &&
		applicantInfo.address && applicantInfo.address !== '' &&
		applicantInfo.city && applicantInfo.city !== '' &&
		applicantInfo.state && applicantInfo.state !== '' &&
		applicantInfo.zip && applicantInfo.zip !== '' &&
		applicantInfo.phone && applicantInfo.phone !== '',
		applicantInfo.email && applicantInfo.email !== '');
};

var ApplicantInfo = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation,
        Reflux.listenTo(ApplicationStore, "onUpdateCoapplicant")
	],

	statics: {
		willTransitionTo: function (transition) {
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
			messageText: '',
			showMessage: false,
			messageType: 'error',
            hasCoapplicant: UserStore.getCurrentUser().hasCoapplicant || true
		};
	},

	componentDidMount: function() {
		User.getUserDetails(UserStore.getCurrentUserId()).then(function(userDetails) {
			this.refs.firstName.getDOMNode().value = userDetails.firstName;
			this.refs.middleName.getDOMNode().value = userDetails.middleName;
			this.refs.lastName.getDOMNode().value = userDetails.lastName;
			this.refs.address.getDOMNode().value = userDetails.address;
			this.refs.city.getDOMNode().value = userDetails.city;
			this.refs.state.getDOMNode().value = userDetails.state;
			this.refs.zip.getDOMNode().value = userDetails.zip;
			this.refs.phone.getDOMNode().value = userDetails.phone;
			this.refs.email.getDOMNode().value = userDetails.email;
            if(userDetails.coUID == undefined && userDetails.isPrimaryApplicant){
                ApplicationActions.addCoapplicant();
            }
		}.bind(this), function(error) {
			this.setState({
				showMessage: true,
				messageText: error.responseJSON.message,
				messageType: 'error'
			});
		}.bind(this));
	},

	back: function() {
		this.transitionTo('dashboardApplications');
	},

    onUpdateCoapplicant: function(){
        this.setState({
            hasCoapplicant: !ApplicationStore.hasCoapplicant()
        });
    },
	
	onSubmitInfo: function(e){
		e.preventDefault();

		var applicantInfo = {
			firstName: this.refs.firstName.getDOMNode().value,
			middleName: this.refs.middleName.getDOMNode().value || '',
			lastName: this.refs.lastName.getDOMNode().value,
			address: this.refs.address.getDOMNode().value,
			city: this.refs.city.getDOMNode().value,
			state: this.refs.state.getDOMNode().value,
			zip: this.refs.zip.getDOMNode().value,
			phone: this.refs.phone.getDOMNode().value,
			email: this.refs.email.getDOMNode().value || ''
		};

		if(validateApplicantInfo(applicantInfo)) {
			applicantInfo.phone = applicantInfo.phone.replace(/\D/g, '');

			User.update(UserStore.getCurrentUserId(), applicantInfo).then(function () {
				this.setState({
					showMessage: true,
					messageText: 'Successfully updated profile details!',
					messageType: 'success'
				});
			}.bind(this), function (error) {
				this.setState({
					showMessage: true,
					messageText: error.responseJSON.message,
					messageType: 'error'
				});
			}.bind(this));
		} else {
			this.setState({
				showMessage: true,
				messageText: 'All the fields are required.',
				messageType: 'error'
			});
		}
	},

	render: function() {
		return (
            <div className="container">
                <div className="row bordered-bottom gap-bottom">
                    <h1 className="col-sm-9 col-xs-12"><i className="fa fa-chevron-left pointer" onClick={this.back}></i> Edit Profile</h1>
                    <Link className={"col-sm-3 col-xs-12 pull-right btn btn-md btn-dark-blue dashboard-header-btn " + (this.state.hasCoapplicant ? "hidden" : "")} to="addCoapplicant"><i className="fa fa-plus-square-o"></i>&nbsp;&nbsp;Add Coapplicant</Link>
                </div>
                <div className="row">
                    <h3 className="col-xs-12">Name</h3>
                    <form className="row">
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="firstName" placeholder="First Name" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="middleName" placeholder="Middle Name" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="lastName" placeholder="Last Name" required />
                        </div>
                    </form>
                </div>
                <div className="row">
                    <h3 className="col-xs-12">Address</h3>
                    <form className="row">
                        <div className="row gap-bottom">
                            <div className="col-md-9 col-xs-12">
                                <input className="form-control" type="text" ref="address" placeholder="address"  required />
                            </div>
                        </div>
                        <div className="row gap-bottom">
                            <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                                <input className="form-control" type="text" ref="city" placeholder="City" required />
                            </div>
                            <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                                <select ref="state" className="form-control">
                                    {Constants.usStates.map(function(state) {
                                        return <option key={state.data} value={state.data}>{state.label}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                                <input className="form-control" type="text" ref="zip" placeholder="Zip Code" required />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row double-gap-bottom">
                    <h3 className="col-xs-12">Contact Information</h3>
                    <form className="row">
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="text" ref="phone" placeholder="Mobile Phone" required />
                        </div>
                        <div className="col-md-3 col-sm-4 col-xs-12 gap-bottom">
                            <input className="form-control" type="email" ref="email" placeholder="Email" required />
                        </div>
                    </form>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row">
                            <MessageBox gridPos="col-sm-6 col-xs-12" displayMessage={this.state.showMessage} message={this.state.messageText} type={this.state.messageType} />
                        </div>
                        <div className="row">
                            <button className="btn btn-md btn-dark-blue col-sm-6 col-xs-12" onClick={this.onSubmitInfo}>Continue</button>
                        </div>
                    </div>
                </div>
                <RouterHandle />
            </div>
		)
	}

});

module.exports = ApplicantInfo;
