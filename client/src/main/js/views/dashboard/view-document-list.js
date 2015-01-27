var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var moment = require('moment');
var User = require('../../models/model-user');
var Application = require('../../models/model-application');
var ErrorMessage = require('../../components/error-message');
var fileSaver = require('browser-filesaver');

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
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
            documents: []
        }
    },

    componentDidMount: function(){
        this.getDocuments();
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
        this.transitionTo('uploadExistingDocument', {appId: this.getParams().appId, documentId: document._id});
    },

    onDocumentView: function(document) {
        var appId = this.getParams().appId,
            docId = document._id;
        this.transitionTo('viewDocument', {appId: appId, documentId: docId});
    },

    getDocuments: function() {
        Application.getDocuments(this.getParams().appId).then(function(documents){
            this.setState({
                documents: documents
            });
        }.bind(this));
    },

    render: function() {
        var documentsTable = [];
        _.map(this.state.documents, function(document) {

            var viewButton = {
                disabled: true,
                style: 'disabled hidden'
            }, uploadButton = {
                style: 'btn blue six sevenths gap-right'
            };
            
            if(document.uploadDate !== undefined) {
                viewButton.disabled = false;
                viewButton.style =  'btn red three sevenths gap-right';
                uploadButton.style = 'btn blue three sevenths';
            }

            // e.g. Wednesday, January 21, 2015 3:21 PM
            document.requestDate = moment(document.requestDate).format('llll');

            documentsTable.push((
                <tr>
                    <th>{document._id}</th>
                    <th>{document.name}</th>
                    <th>{document.type}</th>
                    <th>{document.description}</th>
                    <th>{document.requestDate}</th>
                    <th>
                        <button className={viewButton.style} disabled={viewButton.disabled} onClick={this.onDocumentView.bind(this, document)}>View</button>
                        <button className={uploadButton.style} onClick={this.onDocumentUpload.bind(this, document)}>Upload</button>
                    </th>
                </tr>
            ));
        }, this);

        return (
            <div className="container">
                <div className="gap-top">
                    <div className="row">
                        <h1 className="one ninth">Documents</h1>
                        <button className="btn blue one eighth skip-six gap-top" onClick={this.onNewDocumentUpload}>New Document</button>
                    </div>
                    <table className="responsive">
                        <thead>
                            <tr>
                                <th>ID</th>
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
                <RouterHandler/>
            </div>
        );
    }
});

module.exports = Documents;
