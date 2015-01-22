var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var RouterHandler = Router.RouteHandler;
var _ = require('lodash');
var moment = require('moment');
var User = require('../../models/model-user');
var Application = require('../../models/model-application');
var ErrorMessage = require('../../components/error-message');

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
        Application.getDocuments(this.getParams().appId).then(function(documents){
            this.setState({
                documents: documents
            });
        }.bind(this));
    },

    onDocumentUpload: function() {
        this.transitionTo('upload', {appId: this.getParams().appId});
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
                    <h1>Documents</h1>
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
