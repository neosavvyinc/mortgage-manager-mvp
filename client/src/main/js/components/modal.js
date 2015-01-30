'use strict';

var React = require('react'),
	Router = require('react-router'),
	RouterHandler = Router.RouteHandler,
	Location = Router.HistoryLocation;

var Modal = React.createClass({
	closeModal: function() {
		Location.pop();
	},

	render: function() {
		return (
			<div className="modalDialog">
				<div className="row">
					<RouterHandler/>
				</div>
			</div>
		);
	}
});

module.exports = Modal;