/**
 * @jsx React.DOM
 */

var PDF = require('../../components/pdf-viewer'),
	React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Application = require('../../models/model-application'),
	EndPoints = require('../../constants/endpoints');

var ViewPdf = React.createClass({

	mixins: [
		Router.State
	],

	getInitialState: function() {
		return {
			file: EndPoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId),
			page: 1
		}
	},

	render: function() {
		return (
			<div>
				 <PDF file={this.state.file} page={this.state.page} />
			</div>
		)
	}
});

module.exports = ViewPdf;