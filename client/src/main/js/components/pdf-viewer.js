'use strict';

var React = require('react'),
	Router = require('react-router');

var Pdf = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function() {
		return {
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth
		};
	},

	componentDidMount: function() {
		var self = this;
		PDFJS.workerSrc = "js/pdf.worker.js";
		PDFJS.getDocument(this.props.file).then(function(pdf) {
			pdf.getPage(self.props.page).then(function(page) {
				self.props.onLoadCallback(pdf.numPages);
				self.setState({pdfPage: page, pdf: pdf});
			});
		});

		//Adding this listener to render the canvas everytime the window is resized.
		window.addEventListener('resize', this.handleResize);
	},

	getDefaultProps: function() {
		return {page: 1};
	},

	componentWillReceiveProps: function(newProps) {
		var self = this;
		if (newProps.page !== self.props.page) {
			self.state.pdf.getPage(newProps.page).then(function(page) {
				self.setState({pdfPage: page, pageId: newProps.page});
			});

			this.setState({
				pdfPage: null
			});
		}
	},

	handleResize: function() {
		this.setState({
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth
		});
	},

	close: function() {
		this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
	},

	render: function() {
		var self = this;

		if (self.state.pdfPage) {
			setTimeout(function() {
				var canvas = self.refs.canvas.getDOMNode(),
					context = canvas.getContext('2d'),
					scale = 1.0,
					viewport = self.state.pdfPage.getViewport(scale),
					renderContext = {};

				if(self.state.windowHeight) {
					scale = (self.state.windowHeight-100) / viewport.height;
					viewport = self.state.pdfPage.getViewport(scale);
				}

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				self.state.pdfPage.render(renderContext);

			});
		}

		return this.state.pdfPage ?
			(<div>
				<div className="pdfComponent">
                    <button type="button" className="close" onClick={self.close}><span aria-hidden="true">&times;</span></button>
					<canvas ref="canvas"></canvas>
				</div>
			</div>) :
			(<div className="loader">
				<i className="fa fa-spinner fa-pulse"></i>
			</div>);
	}
});

module.exports = Pdf;