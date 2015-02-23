'use strict';

var React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Location = Router.HistoryLocation,
	DocumentActions = require('../../actions/action-document'),
	DocumentStore = require('../../stores/store-document'),
	Document = require('../../models/model-document'),
	Application = require('../../models/model-application'),
	MessageBox = require('../../components/message-box');

//Validate Document Info
var validateDocumentInfo = function(document) {
	return (document.name && document.name !== '' &&
			document.type && document.type !== '' &&
			document.file && document.file !== '');
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
		};
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

	close: function(e) {
        if(e) {
            e.preventDefault();
        }
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
			fileHandler: event.target.files[0],
			loader: false
		});
	},

	onUploadDocument: function(e) {
        e.preventDefault();

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
				this.setState({
					loader: true
				});
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
			uploadMessage: 'File successfully uploaded!',
			loader: false
		});
		this.close();
	},

	render: function() {
		return (this.state.loader) ? (<div className="loader"> <i className="fa fa-spinner fa-pulse"></i> </div>) :
			(
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form encType="multipart/form-data">
                                <div className="modal-header">
                                    <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                    <h3 className="modal-title">Upload Document</h3>
                                </div>
                                <div className="modal-body">
                                    <div className="row double-gap-top">
                                        <div className="col-sm-6 col-xs-12 gap-bottom">
                                            <input className="form-control" ref="docName" type="text" placeholder="Document Name" value={this.state.docName} onChange={this.updateDocName}/>
                                        </div>
                                        <div className="col-sm-6 col-xs-12 gap-bottom">
                                            <select className="form-control" value={this.state.type} ref="docType" onChange={this.updateDocType}>
                                                <option value="Tax Document">Tax Document</option>
                                                <option value="Income Document">Income Document</option>
                                                <option value="Identity Document">Identity Document</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row double-gap-top double-gap-bottom">
                                        <div className="col-sm-8 col-xs-12 gap-bottom">
                                            <input className="form-control" type="text" placeholder="Choose File" value={this.state.fileName} disabled/>
                                        </div>
                                        <div className="col-sm-4 col-xs-12 gap-bottom">
                                            <div className="fileUpload btn btn-primary col-xs-12">
                                                <span>Select File</span>
                                                <input ref="uploadBtn" onChange={this.handleFileName} readOnly type="file" className="upload" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-12">
                                            <MessageBox displayMessage={this.state.success} message={this.state.uploadMessage} type='success' />
                                            <MessageBox displayMessage={this.state.error} message={this.state.uploadMessage} type='error' />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" onClick={this.close}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.onUploadDocument}>Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
			);
	}
});

module.exports = UploadDocument;