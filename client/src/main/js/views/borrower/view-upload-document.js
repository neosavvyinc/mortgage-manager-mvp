'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	DocumentActions = require('../../actions/action-document'),
	DocumentStore = require('../../stores/store-borrower'),
	Document = require('../../models/model-document'),
	ErrorMessage = require('../../components/component-error-msg'),
	SuccessMessage = require('../../components/component-success-msg');

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
			type: 'Income Document',
			fileName: '',
			fileHandler: '',
			uploadMessage: '',
			success: false,
			error: false
		}
	},

	close: function() {
		this.transitionTo('dashboard');
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

	onUploadDocument: function(e) {
		var documentInfo = {
			name: this.state.docName,
			type: this.state.type,
			file: this.state.fileName
		};

		if(validateDocumentInfo(documentInfo)) {
			documentInfo.file = this.state.fileHandler;
			Document.upload('9e59aaa0-9cf3-11e4-8bb9-13ea8b3f1e80', documentInfo).then(function(){
				DocumentActions.uploadDocument(documentInfo);
			}.bind(this), function(error){
				this.setState({
					error: true,
					uploadMessage: error.message
				});
			}.bind(this));
		} else {
			this.setState({
				error: true,
				uploadMessage: 'All Fields are required'
			});
		}
	},

	onDisplayMessage: function() {
		this.setState({
			success: true,
			uploadMessage: 'File successfully uploaded'
		});
	},

	render: function() {
		return (
			<form className="uploadComponent" enctype="multipart/form-data">
				<legend><h1>Upload Document</h1></legend>
				<div className="row">
					<div className="two fourths padded">
						<input ref="docName" type="text" placeholder="Document Name" onChange={this.updateDocName}/>
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
						<SuccessMessage errorDisplay={this.state.success} errorMessage={this.state.uploadMessage}/>
						<ErrorMessage errorDisplay={this.state.error} errorMessage={this.state.uploadMessage}/>
					</div>
				</div>
			</form>
		);
	}
});

module.exports = UploadDocument;