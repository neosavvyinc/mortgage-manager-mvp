'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var moment = require('moment');
var User = require('../../../models/model-user');
var UserStore = require('../../../stores/store-user');
var Application = require('../../../models/model-application');
var MessageBox = require('../../../components/message-box');
var Navigation = require('../../../components/navigation');
var Endpoints = require('../../../constants/endpoints');

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
        this.transitionTo('uploadNewDocument', {appId: this.getParams().appId});
    },

    onDocumentUpload: function(document) {
        this.transitionTo('uploadExistingDocument', {appId: this.getParams().appId, tab: 0, documentId: document._id});
    },

	onDocumentDownload: function(document) {
		window.open(Endpoints.APPLICATIONS.ONE.DOWNLOAD.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', document._id));
	},

    onDocumentView: function(document) {
        var appId = this.getParams().appId,
            docId = document._id;
        this.transitionTo('viewDocument', {appId: appId, tab: 0, documentId: docId});
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
                            tab: 0,
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
                            tab: 0,
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
                            tab: 0
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
				    disabled: tabsDisabled
			    },
			    icon: 'fa fa-download'
		    });
	    }

        _.map(this.state.documents, function(document) {

            var viewButton = {
                disabled: true,
                style: 'disabled hidden'
            }, uploadButton = {
                style: 'btn blue block gap-right five sixths',
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
		            viewButton.style =  'btn red disabled gap-right tooltip';
		            downloadButton.style =  'btn green disabled gap-right tooltip';
		            uploadButton.style =  'btn disabled blue gap-right tooltip';
	            } else {
		            viewButton.disabled = false;
		            viewButton.style =  'btn red gap-right gap-bottom tooltip';
		            uploadButton.style = 'btn blue gap-right gap-bottom tooltip';
		            downloadButton.disabled = false;
		            downloadButton.style =  'btn green tooltip';
	            }
            } else {
	            uploadButton.style =  'btn blue block gap-right five sixths tooltip';
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
					        <button className={viewButton.style} disabled={viewButton.disabled} onClick={this.onDocumentView.bind(this, document)} data-tooltip="View">
						        <i className="fa fa-binoculars"></i>
					        </button>
					        <button className={downloadButton.style} disabled={downloadButton.disabled} onClick={this.onDocumentDownload.bind(this, document)} data-tooltip="Download">
						        <i className="fa fa-download"></i>
					        </button>
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
					        <button className={viewButton.style} disabled={viewButton.disabled} onClick={this.onDocumentView.bind(this, document)} data-tooltip="View">
						        <i className="fa fa-binoculars"></i>
					        </button>
					        <button className={uploadButton.style} disabled={uploadButton.disabled} onClick={this.onDocumentUpload.bind(this, document)} data-tooltip="Upload">{uploadButton.text}
						        <i className="fa fa-upload"></i>
					        </button>
					        <button className={downloadButton.style} disabled={downloadButton.disabled} onClick={this.onDocumentDownload.bind(this, document)} data-tooltip="Download">
						        <i className="fa fa-download"></i>
					        </button>
				        </th>
			        </tr>
		        ));
	        }
        }, this);

        return (
            <div className="container">
                <div className="gap-top">
                    <h2>Documents</h2>
                    <Navigation navigationItems={actions}/>
                    <table className="responsive">
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
