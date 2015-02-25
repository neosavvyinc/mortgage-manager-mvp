'use strict';

var PDF = require('../../../components/pdf-viewer'),
	React = require('react'),
	Router = require('react-router'),
	Application = require('../../../models/model-application'),
	User = require('../../../models/model-user'),
	Document = require('../../../models/model-document'),
	EndPoints = require('../../../constants/endpoints');

var ViewPdf = React.createClass({

	mixins: [
		Router.State,
        Router.Navigation
	],

	getInitialState: function () {
		return {
			page: 1,
			prevClass: 'hidden',
			nextClass: 'hidden',
			loaded: false
		};
	},

	componentWillMount: function() {
		User.checkS3Enabled().then(
			function(response) {
				if(response.s3Enabled) {
					Document.getS3Url(this.getParams().appId, this.getParams().documentId).then(
						function(response) {
							this.setState({
								file: response,
								page: 1,
								prevClass: 'hidden',
								nextClass: 'hidden'
							});
						}.bind(this)
					);
				} else {
					this.setState({
						file: EndPoints.APPLICATIONS.ONE.FILE.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId),
						page: 1,
						prevClass: 'hidden',
						nextClass: 'hidden'
					});
				}
			}.bind(this)
		);
	},

	onPdfLoad: function(numPages) {
		if(numPages > 1) {
			this.setState({numPages: numPages, nextClass: 'fa fa-chevron-right pointer pdfNext', loaded: true});
		} else {
			this.setState({loaded: true});
		}
	},

	prevPage: function(ev) {
		ev.preventDefault();

		var page = this.state.page > 1 ? this.state.page - 1 : 1,
			prevClass = page>1 ? 'fa fa-chevron-left pointer pdfPrev' : 'hidden',
			nextClass = page===this.state.numPages ? 'hidden' : 'fa fa-chevron-right pointer pdfNext';

		this.setState({
			page: page,
			prevClass: prevClass,
			nextClass: nextClass
		});
	},

    close: function(){
        this.transitionTo('dashboardAppDetails', {appId: this.getParams().appId, tabName: 'documents'});
    },

	nextPage: function(ev) {
		ev.preventDefault();

		var page = this.state.page < this.state.numPages ? this.state.page + 1 : this.state.page,
			prevClass = page>1 ? 'fa fa-chevron-left pointer pdfPrev' : 'hidden',
			nextClass = page===this.state.numPages ? 'hidden' : 'fa fa-chevron-right pointer pdfNext';

		this.setState({
			page: page,
			prevClass: prevClass,
			nextClass: nextClass
		});
	},

	download: function() {
		//Will download file
		window.open(EndPoints.APPLICATIONS.ONE.DOWNLOAD.ONE.URL.replace(':id', this.getParams().appId).replace(':docId', this.getParams().documentId));
	},

	render: function() {
		return (
			<div>
                <div className="row gap-top">
                    <div className="col-sm-4 col-sm-offset-4 col-xs-12">
                        <div className="btn btn-default col-xs-6" onClick={this.close}><i className="fa fa-chevron-left"></i> Close</div>
                        <div className="btn btn-primary pull-right col-xs-6" onClick={this.download}>Download <i className="fa fa-download pointer"></i></div>
                    </div>
                </div>
				<div className="row">
					<div className>
					    <PDF file={this.state.file} page={this.state.page} onLoadCallback={this.onPdfLoad} loaded={this.state.loaded}/>
					</div>
					<div> <i className={this.state.prevClass} onClick={this.prevPage}></i> </div>
					<div> <i className={this.state.nextClass} onClick={this.nextPage}></i> </div>
				</div>
			</div>
		)
	}
});

module.exports = ViewPdf;