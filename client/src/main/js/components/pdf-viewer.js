'use strict';

var React = require('react'),
	Router = require('react-router');

var Pdf = React.createClass({

	mixins: [
		Router.State,
		Router.Navigation
	],

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		var self = this;
		PDFJS.workerSrc = "js/pdf.worker.js";
		PDFJS.getDocument(this.props.file).then(function(pdf) {
			pdf.getPage(self.props.page).then(function(page) {
				self.setState({pdfPage: page, pdf: pdf});
			});
		});
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

	close: function() {
		this.transitionTo('dashboardDocuments', {appId: this.getParams().appId});
	},

	render: function() {
		var self = this;
		if (this.state.pdfPage) setTimeout(function() {
			var canvas = self.refs.canvas.getDOMNode(),
				context = canvas.getContext('2d'),
				scale = 1.0,
				viewport = self.state.pdfPage.getViewport(scale);
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			self.state.pdfPage.render(renderContext);
		});
		return this.state.pdfPage ?
			(<div className="pdfComponent">
				<div onClick={self.close} title="Close" className="close">X</div>
				<canvas ref="canvas"></canvas>
			</div>) :
			(<div className="loader">
				<img src="http://www.kingpizza.com.br/imagens/loader.gif"/>
			</div>);
	}
});

module.exports = Pdf;