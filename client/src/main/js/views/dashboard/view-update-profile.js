'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Constants = require('../../constants/constants'),
	MessageBox = require('../../components/message-box'),
	User = require('../../models/model-user'),
	BorrowerActions = require('../../actions/action-borrower'),
	UserStore = require('../../stores/store-user'),
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
		Router.Navigation
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
			messageType: 'error'
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
			//TODO - probably dissuade the user from using dots or have separate fields for each part of the phone number
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
				<h1><span className="tooltip" data-tooltip="Back"><i className="fa fa-chevron-left pointer" onClick={this.back}></i></span> Edit Profile</h1>
				<div className="gap-top divBorder">
					<h2>Name</h2>
					<div className="row gap-bottom">
						<input className="one fourth half-gap-right" type="text" ref="firstName" placeholder="First Name" required />
						<input className="one fourth half-gap-right" type="text" ref="middleName" placeholder="Middle Name" required />
						<input className="one fourth" type="text" ref="lastName" placeholder="Last Name" required />
					</div>
					<div className="row">
						<h2 className="one third">Address</h2>
					</div>
					<div>
						<div className="row gap-bottom">
							<input className="three fourths" type="text" ref="address" placeholder="address"  required />
						</div>
						<div className="row gap-bottom">
							<input className="one fourth half-gap-right" type="text" ref="city" placeholder="City" required />
							<select ref="state" className="one fourth half-gap-right">
                        {Constants.usStates.map(function(state) {
	                        return <option key={state.data} value={state.data}>{state.label}</option>;
                        })}
							</select>
							<input className="one fourth" type="text" ref="zip" placeholder="Zip Code" required />
						</div>
					</div>
					<h2>Contact Information</h2>
					<div className="row gap-bottom">
						<input className="one third half-gap-right" type="text" ref="phone" placeholder="Mobile Phone" required />
						<input className="one third" type="email" ref="email" placeholder="Email" required />
					</div>
					<div className="row">
						<button className="one third turquoise button" onClick={this.onSubmitInfo}>Continue</button>
					</div>
					<div className="row one third gap-top">
						<MessageBox displayMessage={this.state.showMessage} message={this.state.messageText} type={this.state.messageType} />
					</div>
				</div>
			</div>
		)
	}

});

module.exports = ApplicantInfo;
