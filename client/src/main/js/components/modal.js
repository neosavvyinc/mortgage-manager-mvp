'use strict';

var React = require('react'),
	Router = require('react-router'),
	RouterHandler = Router.RouteHandler;

var Modal = React.createClass({

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