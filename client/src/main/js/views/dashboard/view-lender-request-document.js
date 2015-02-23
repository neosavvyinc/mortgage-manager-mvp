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
			typeClass: 'col-sm-6 col-xs-12 gap-bottom',
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
        if(e){
            e.preventDefault();
        }
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
            <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form encType="multipart/form-data">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title">Request Document</h3>
                            </div>
                            <div className="modal-body">
                                <div className="row double-gap-top">
                                    <div className="col-sm-6 col-xs-12 gap-bottom">
                                        <input className="form-control" ref="docName" type="text" placeholder={this.state.inputPlaceHolder}/>
                                    </div>
                                    <div className={this.state.typeClass}>
                                        <select className="form-control" ref="docType">
                                            <option value="Tax Document">Tax Document</option>
                                            <option value="Income Document">Income Document</option>
                                            <option value="Identity Document">Identity Document</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row double-gap-top double-gap-bottom">
                                    <div className="col-xs-12">
                                        <textarea className="form-control" rows="10" ref="description" placeholder={this.state.textAreaPlaceHolder}></textarea>
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
                                <button type="button" className="btn btn-primary" onClick={this.onRequestDocument}>Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		);
	}
});

module.exports = RequestDocument;