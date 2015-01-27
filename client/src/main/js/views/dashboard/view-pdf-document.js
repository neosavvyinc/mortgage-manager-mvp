/**
 * @jsx React.DOM
 */

var PDF = require('../../components/pdf-viewer'),
	React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	Application = require('../../models/model-application');
var BASE64_MARKER = ';base64,';
function convertDataURIToBinary(dataURI) {
	var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	var base64 = dataURI.substring(base64Index);
	var raw = window.atob(base64);
	var rawLength = raw.length;
	var array = new Uint8Array(new ArrayBuffer(rawLength));

	for (i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

var ViewPdf = React.createClass({

	mixins: [
		Router.State
	],

	getInitialState: function() {
		return {
			file: 'blah.pdf',
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