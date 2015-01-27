'use strict';

var React = require('react');

var Pdf = React.createClass({

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		var self = this;
		PDFJS.workerSrc = "js/pdfjs-1.0.473-dist/build/pdf.worker.js";
		PDFJS.getDocument(this.props.file).then(function(pdf) {
			pdf.getPage(self.props.page).then(function(page) {
				self.setState({pdfPage: page, pdf: pdf});
			});
		});
	},

	getDefaultProps: function() {
		return {page: 1};
	},

	render: function() {
		var self = this;
		if (this.state.pdfPage) setTimeout(function() {
			var canvas = self.getDOMNode(),
				context = canvas.getContext('2d'),
				scale = self.props.scale || 1.0,
				viewport = self.state.pdfPage.getViewport(scale);
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			self.state.pdfPage.render(renderContext);
		});
		return this.state.pdfPage ? <canvas></canvas> : <div className="row">Loading Document..</div>;
	}
});

module.exports = Pdf;