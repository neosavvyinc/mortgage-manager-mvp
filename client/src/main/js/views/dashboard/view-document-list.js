var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var moment = require('moment');
var User = require('../../models/model-user');
var Application = require('../../models/model-application');
var ErrorMessage = require('../../components/error-message');

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
        this.transitionTo('uploadExistingDocument', {appId: this.getParams().appId, document: JSON.stringify(document)});
    },

    getDocuments: function() {
        Application.getDocuments(this.getParams().appId).then(function(documents){
            this.setState({
                documents: documents
            });
        }.bind(this));
    },

    render: function(){

        var documentsTable = [];

        _.map(this.state.documents, function(document){

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
                        <button className="btn blue" onClick={this.onDocumentUpload.bind(this, document)}>Upload</button>
                    </th>
                </tr>
            ));
        }, this);

        return (
            <div className="container">
                <div className="gap-top">
                    <div className="row">
                        <h1 className="one seventh">Documents</h1>
                        <button className="btn blue one ninth skip-six gap-right gap-top" onClick={this.onNewDocumentUpload}>New Document</button>
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
