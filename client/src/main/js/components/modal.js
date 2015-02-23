'use strict';

var React = require('react'),
	Router = require('react-router'),
	RouterHandler = Router.RouteHandler;

var Modal = React.createClass({

	render: function() {
		return (
			<div className="modalDialog">
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <RouterHandler/>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
});

module.exports = Modal;