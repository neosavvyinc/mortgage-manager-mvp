'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	modelDocument = require('../../models/model-document'),
	MessageBox = require('../../components/message-box'),
	UserStore = require('../../stores/store-user');

var validateInfo = function(document) {
	return (document.name && document.name !== '' &&
	document.type && document.type !== '' &&
	document.description && document.description !== '' &&
	document.requesterId && document.requesterId !== '');
};

var RequestDocument = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function() {
		return {
			inputPlaceHolder: 'Document Name',
			typeClass: 'two fourths padded',
			textAreaPlaceHolder: 'Description of document',
			success: false,
			error: false
		};
	},

	componentWillMount: function() {
		(this.getParams().docType !== 'standard') ?
			this.setState({
				inputPlaceHolder: 'Explanation summary',
				typeClass: 'hidden',
				textAreaPlaceHolder: 'Provide a list of explanations required or just one explanation you need to provide to your underwriters.'
			}) : null;
	},

	close: function(e) {
        e.preventDefault();

		this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
	},

	onRequestDocument: function(e) {
        e.preventDefault();

		var documentInfo = {
			name: this.refs.docName.getDOMNode().value,
			type: (this.getParams().docType === 'standard') ? this.refs.docType.getDOMNode().value : 'Explanation',
			description: this.refs.description.getDOMNode().value,
			requesterId: UserStore.getCurrentUserId(),
			amount: 1
		};

		//Call Endpoint to persist document details in mongo.
		if(validateInfo(documentInfo)) {
			modelDocument.create(this.getParams().appId, documentInfo).then(function() {
					this.close();
				}.bind(this),
				function(error) {
					console.log(error);
					this.setState({
						success: false,
						error: true,
						message: error.message
					});
				}.bind(this)
			);
		} else {
			this.setState({
				success: false,
				error: true,
				uploadMessage: 'All Fields are required'
			});
		}
	},

	render: function() {
		return (
			<div>
				<form className="uploadComponent" encType="multipart/form-data">
					<div onClick={this.close} title="Close" className="close">X</div>
					<legend><h1> Request Document</h1></legend>
					<div className="row">
						<div className="two fourths padded">
							<input ref="docName" type="text" placeholder={this.state.inputPlaceHolder}/>
						</div>
						<div className={this.state.typeClass}>
							<span className="select-wrap">
								<select ref="docType">
									<option value="Tax Document">Tax Document</option>
									<option value="Income Document">Income Document</option>
									<option value="Identity Document">Identity Document</option>
								</select>
							</span>
						</div>
					</div>
					<div className="row">
						<div className="padded">
							<textarea ref="description" placeholder={this.state.textAreaPlaceHolder}></textarea>
						</div>
					</div>
					<div className="row">
						<div className="one fourth skip-two padded submit">
							<button className="red block gap-right gap-bottom" onClick={this.close}>Close</button>
						</div>
						<div className="one fourth padded submit">
							<button className="green block gap-right gap-bottom" onClick={this.onRequestDocument}>Request</button>
						</div>
					</div>
					<div className="row">
						<div className="two fourths skip-one">
							<MessageBox displayMessage={this.state.success} message={this.state.message} type='success' />
							<MessageBox displayMessage={this.state.error} message={this.state.message} type='error' />
						</div>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = RequestDocument;