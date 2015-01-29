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
		Router.State,
		Router.Navigation
	],

	close: function() {
		this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
	},

	getInitialState: function() {
		return {
			file: EndPoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId),
			page: 1
		}
	},

	prevPage: function(ev) {
		ev.preventDefault();
		this.setState({
			page: this.state.page > 1 ? this.state.page - 1 : 1
		});
	},

	nextPage: function(ev) {
		ev.preventDefault();
		this.setState({
			page: this.state.page + 1
		});
	},

	download: function() {
		//Will download file
		window.open(EndPoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId));
	},

	render: function() {
		return (
			<div>
				<nav>
					<ul className = "nav-bar">
						<li><span onClick={this.nextPage}> Next </span></li>
						<li><span onClick={this.prevPage}> Prev </span></li>
						<li><span onClick={this.download}> Download </span></li>
					</ul>
				</nav>
				<div className="pdfComponent">
					<div onClick={this.close} title="Close" className="close">X</div>
				    <PDF file={this.state.file} page={this.state.page} />
				</div>
			</div>
		)
	}
});

module.exports = ViewPdf;