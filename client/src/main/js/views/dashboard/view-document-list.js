var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');
var moment = require('moment');

var User = require('../../models/model-user');
var Application = require('../../models/model-application');
var ErrorMessage = require('../../components/error-message');
var ApplicationStore = require('../../stores/store-application');

var NewPassword = React.createClass({

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
        //Application.getDocuments(ApplicationStore.getCurrentApplication()._id).then(function(documents){
        //    this.setState({
        //        documents: documents
        //    });
        //}.bind(this));
    },

    render: function(){

        var documentsTable = [];

        _.map(this.state.documents, function(document){

            //// e.g. Wednesday, January 21, 2015 3:21 PM
            //app.created = moment(app.created).format('llll');
            //app.lastModified = moment(app.lastModified).format('llll');

            documentsTable.push((
                <tr>
                    <th>{document._id}</th>
                    //<th>{doc.created}</th>
                    //<th>{doc.lastModified}</th>
                    //<th>
                    //    <div className="row">
                    //        <button className="btn turquoise one half" onClick={this.onApplicationSelect(app)}>View</button>
                    //        <button className="btn red one half">Delete</button>
                    //    </div>
                    //</th>
                </tr>
            ));
        });

        return (
            <div className="container">
                <div className="gap-top">
                    <h1>Applications</h1>
                    <table className="responsive">
                        <thead>
                            <tr>
                                <th>ID</th>
                                //<th>Last Created</th>
                                //<th>Last Modified</th>
                                //<th>Status</th>
                                //<th>Action</th>
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

module.exports = NewPassword;
