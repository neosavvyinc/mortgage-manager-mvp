'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var moment = require('moment');
var User = require('../../models/model-user');
var UserStore = require('../../stores/store-user');
var Application = require('../../models/model-application');
var MessageBox = require('../../components/message-box');
var Navigation = require('../../components/navigation');
var LendersTable = require('./view-lender-list');
var EndPoints = require('../../constants/endpoints');

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i]) {
	        return false;
        }
    }
    return true;
};

var Documents = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    getInitialState: function(){
        return {
            documents: [],
            userType: '',
	        disableButtons: false
        };
    },

    componentDidMount: function(){
        this.getDocuments();
		User.getUserDetails(UserStore.getCurrentUserId()).then(function(user) {
			var createdDate = moment(user.created),
				currentDate = moment(),
				duration = moment.duration(currentDate.diff(createdDate)),
				state = {
					userType: user.type
				};

			if(user.type === 'borrower' && user.pricingPlan === 'trial' && duration.asDays() > 15) {
				state.disableButtons = true;
			}

			this.setState(state);

        }.bind(this));
    },

    componentDidUpdate: function(prevProps, prevState) {
        if(arraysEqual(prevState.documents, this.state.documents)) {
            this.getDocuments();
        }
    },

    onNewDocumentUpload: function() {
        this.transitionTo('uploadNewDocument', {appId: this.getParams().appId, tabName: 'documents'});
    },

    onDocumentUpload: function(document) {
        this.transitionTo('uploadExistingDocument', {appId: this.getParams().appId, documentId: document._id, tabName: 'documents'});
    },

	onDocumentDownload: function(document) {
		//Will download file
		window.open(EndPoints.APPLICATIONS.ONE.DOWNLOAD.ONE.URL.replace(':id', this.getParams().appId).replace(':docId',document._id));
	},

    onDocumentView: function(document) {
        var appId = this.getParams().appId,
            docId = document._id;
        this.transitionTo('viewDocument', {appId: appId, documentId: docId, tabName: 'documents'});
    },

    getDocuments: function() {
        Application.getDocuments(this.getParams().appId).then(function(documents) {
	        var sortedDocs = _.sortBy(documents, 'uploadDate');
            this.setState({
                documents: sortedDocs
            });
        }.bind(this));
    },

    render: function() {

        var documentsTable = [];

        var actions, tabs;

	    var actionStyle = {
	        width: '16%'
	    }, otherColStyle ={
	        width: '21%'
	    };

	    var tabsDisabled = false;

	    if(this.state.disableButtons) {
			tabsDisabled = true;
	    }

        if(this.state.userType === 'lender'){
            actions = [
                {
                    tabName: "Request New Document",
                    tabLink: {
                        name: "requestDocument",
                        params: [{
                            appId: this.getParams().appId,
                            tabName: 'documents',
                            docType: 'standard'
                        }]
                    }
                },
                {
                    tabName: "Request Explanation",
                    tabLink: {
                        name: 'requestDocument',
                        params: [{
                            appId: this.getParams().appId,
                            tabName: 'documents',
                            docType: 'explanation'
                        }]
                    }
                }
            ];
        } else if(this.state.userType === 'borrower'){
            actions = [
                {
                    tabName: 'New Document',
                    tabLink: {
                        name: 'uploadNewDocument',
                        params: [{
                            appId: this.getParams().appId,
                            tabName: 'documents'
                        }],
	                    disabled: tabsDisabled
                    },
	                icon: 'fa fa-upload'
                }
            ];
        }

	    if(_.filter(this.state.documents, function(document){
			    return document.uploadDate;
		    }).length) {
		    actions.push( {
			    tabName: 'Download All',
			    tabLink: {
				    callback: function() {
					    //Download a zip of all files
					    window.open(EndPoints.APPLICATIONS.ONE.DOWNLOAD.URL.replace(':id', this.getParams().appId));
				    }.bind(this),
				    disabled: tabsDisabled,
                    tabName: 'documents'
			    },
			    icon: 'fa fa-download'
		    });
	    }

        _.map(this.state.documents, function(document) {

            var viewButton = {
                disabled: true,
                style: 'disabled hidden'
            }, uploadButton = {
                style: 'btn btn-sm btn-success',
	            text: 'Upload ',
                disabled: false
            }, downloadButton = {
	            disabled: true,
	            style: 'disabled hidden'
            };
            
            if(document.uploadDate !== undefined) {
                uploadButton.text = '';
                if(this.state.disableButtons) {
                    viewButton.disabled = true;
                    downloadButton.disabled = true;
                    uploadButton.disabled = true;
                    viewButton.style =  'btn btn-sm btn-primary disabled ';
                    downloadButton.style =  'btn btn-sm btn-success disabled';
                    uploadButton.style =  'btn btn-sm btn-info disabled';
                } else {
                    viewButton.disabled = false;
                    viewButton.style = 'btn btn-sm btn-primary';
                    uploadButton.style = 'btn btn-sm btn-success';
                    uploadButton.text = '';
                    downloadButton.disabled = false;
                    downloadButton.style = 'btn btn-sm btn-info';
                }
            } else {
                uploadButton.style =  'btn btn-sm btn-success';
                if(this.state.disableButtons) {
                    uploadButton.style += ' disabled';
                    uploadButton.disabled = true;
                }
            }

            // e.g. Wednesday, January 21, 2015 3:21 PM
            document.requestDate = moment(document.requestDate).format('llll');

	        if(this.state.userType === 'lender') {
		        documentsTable.push((
			        <tr>
				        <th>{document.name}</th>
				        <th>{document.type}</th>
				        <th>{document.description}</th>
				        <th>{document.requestDate}</th>
				        <th>
                            <ul className="list-inline">
                                <li className={viewButton.disabled ? "" : "btn-group"}>
                                    <button className={viewButton.style} disabled={viewButton.disabled} onClick={this.onDocumentView.bind(this, document)} data-toggle="tooltip" data-placement="bottom" title="View">
                                        <i className="fa fa-binoculars"></i>
                                    </button>
                                </li>
                                <li className={downloadButton.disabled ? "" : "btn-group"}>
                                    <button className={downloadButton.style} disabled={downloadButton.disabled} onClick={this.onDocumentDownload.bind(this, document)} data-toggle="tooltip" data-placement="bottom" title="Download">
                                        <i className="fa fa-download"></i>
                                    </button>
                                </li>
                            </ul>
				        </th>
			        </tr>
		        ));
	        } else {
		        documentsTable.push((
			        <tr>
				        <th>{document.name}</th>
				        <th>{document.type}</th>
				        <th>{document.description}</th>
				        <th>{document.requestDate}</th>
				        <th>
                            <ul className="row">
                                <li className={viewButton.style == "disabled hidden" ? "hidden" : "btn-group"}>
                                    <button className={viewButton.style + (viewButton.disabled ? " disabled half-gap-right half-gap-bottom" : " btn-group half-gap-right half-gap-bottom")} disabled={viewButton.disabled} onClick={this.onDocumentView.bind(this, document)} data-toggle="tooltip" data-placement="bottom" title="View">
                                        <i className="fa fa-binoculars"></i>
                                    </button>
                                </li>
                                <li className="btn-group">
                                    <button className={uploadButton.style + " half-gap-right half-gap-bottom"} disabled={uploadButton.disabled} onClick={this.onDocumentUpload.bind(this, document)} title="Upload">{uploadButton.text}
                                        <i className="fa fa-upload"></i>
                                    </button>
                                </li>
                                <li className={downloadButton.style == "disabled-hidden" ? "hidden" : "btn-group"}>
                                    <button className={downloadButton.style + (downloadButton.disabled ? " disabled half-gap-bottom" : " btn-group half-gap-bottom")} disabled={downloadButton.disabled} onClick={this.onDocumentDownload.bind(this, document)} data-toggle="tooltip" data-placement="bottom" title="Download">
                                        <i className="fa fa-download"></i>
                                    </button>
                                </li>
                            </ul>
				        </th>
			        </tr>
		        ));
	        }
        }, this);

        return (
            <div>
                <h2>Documents</h2>
                <Navigation navigationItems={actions}/>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <col style={otherColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={otherColStyle}/>
                        <col style={actionStyle}/>
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Document Type</th>
                                <th>Description</th>
                                <th>Requested Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentsTable.map(function(document) {
                                return (document);
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = Documents;
