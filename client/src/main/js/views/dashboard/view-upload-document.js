'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Location = Router.HistoryLocation,
	DocumentActions = require('../../actions/action-document'),
	DocumentStore = require('../../stores/store-document'),
	Document = require('../../models/model-document'),
	Application = require('../../models/model-application'),
	ErrorMessage = require('../../components/error-message'),
	SuccessMessage = require('../../components/success-msg');

//Validate Document Info
var validateDocumentInfo = function(document) {
	return (document.name && document.name != "" &&
			document.type && document.type != "" &&
			document.file && document.file != "");
};

var UploadDocument = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation,
		Reflux.listenTo(DocumentStore, 'onDisplayMessage')
	],

	getInitialState: function() {
		return {
			docName: '',
			type: 'Tax Document',
			fileName: '',
			fileHandler: '',
			uploadMessage: '',
			success: false,
			error: false
		}
	},

	componentDidMount: function() {
		this.getDocument();
	},

	getDocument: function() {
		Application.getDocument(this.getParams().appId, this.getParams().documentId).then(function(doc) {
			this.setState({
				docName: doc[0].name,
				type: doc[0].type
			});
		}.bind(this));
	},

	close: function() {
		this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
	},

	updateDocName: function() {
		this.setState({
			docName: this.refs.docName.getDOMNode().value
		});
	},

	updateDocType: function() {
		this.setState({
			type: this.refs.docType.getDOMNode().value
		});
	},
	
	handleFileName: function(event) {
		this.setState({
			fileName: event.target.files[0].name,
			fileHandler: event.target.files[0]
		});
	},

	onUploadDocument: function() {
		var documentInfo = {
			name: this.state.docName,
			type: this.state.type,
			file: this.state.fileName
		};

		if(validateDocumentInfo(documentInfo)) {
			var appId = this.getParams().appId;

			documentInfo.file = this.state.fileHandler;
			documentInfo._id = this.getParams().documentId;

			Document.upload(appId, documentInfo).then(function(){
				DocumentActions.uploadDocument(documentInfo);
			}.bind(this), function(error){
				this.setState({
					success: false,
					error: true,
					uploadMessage: error.message
				});
			}.bind(this));
		} else {
			this.setState({
				success: false,
				error: true,
				uploadMessage: 'All Fields are required'
			});
		}
	},

	onDisplayMessage: function() {
		this.setState({
			error: false,
			success: true,
			uploadMessage: 'File successfully uploaded!'
		});
	},

	render: function() {
		console.log('Rendering');
		return (
			<form className="uploadComponent" encType="multipart/form-data">
				<legend><h1>Upload Document</h1></legend>
				<div className="row">
					<div className="two fourths padded">
						<input ref="docName" type="text" placeholder="Document Name" value={this.state.docName} onChange={this.updateDocName}/>
					</div>
					<div className="two fourths padded">
						<span className="select-wrap">
							<select value={this.state.type} ref="docType" onChange={this.updateDocType}>
								<option value="Tax Document">Tax Document</option>
								<option value="Income Document">Income Document</option>
								<option value="Identity Document">Identity Document</option>
							</select>
						</span>
					</div>
				</div>
				<div className="row">
					<div className="three fourths padded">
						<input type="text" placeholder="Choose File" value={this.state.fileName} disabled/>
					</div>
					<div className="one fourth padded upload">
						<div className="fileUpload block button blue">
							<span>Select File</span>
							<input ref="uploadBtn" onChange={this.handleFileName} readOnly type="file" className="upload" />
						</div>
					</div>
				</div>
				<div className="row">
					<div className="one fourth skip-two padded submit">
						<button className="red block gap-right gap-bottom" onClick={this.close}>Close</button>
					</div>
					<div className="one fourth padded submit">
						<button className="green block gap-right gap-bottom" onClick={this.onUploadDocument}>Upload</button>
					</div>
				</div>
				<div className="row">
					<div className="two fourths skip-one">
						<SuccessMessage successDisplay={this.state.success} message={this.state.uploadMessage}/>
						<ErrorMessage errorDisplay={this.state.error} errorMessage={this.state.uploadMessage}/>
					</div>
				</div>
			</form>
		);
	}
});

module.exports = UploadDocument;