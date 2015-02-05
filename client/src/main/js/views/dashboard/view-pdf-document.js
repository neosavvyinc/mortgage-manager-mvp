'use strict';

var PDF = require('../../components/pdf-viewer'),
	React = require('react'),
	Router = require('react-router'),
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
		};
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
		window.open(EndPoints.APPLICATIONS.ONE.DOWNLOAD.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId));
	},

	render: function() {
		return (
			<div>
				<div className="button pdfDownload">Download <i className="fa fa-download pointer" onClick={this.download}></i></div>
				<div className="row">
					<div className>
					    <PDF file={this.state.file} page={this.state.page}/>
					</div>
					<div> <i className="fa fa-chevron-left pointer pdfPrev" onClick={this.prevPage}></i> </div>
					<div> <i className="fa fa-chevron-right pointer pdfNext" onClick={this.nextPage}></i> </div>
				</div>
			</div>
		)
	}
});

module.exports = ViewPdf;