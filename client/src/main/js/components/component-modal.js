'use strict';

var React = require('react'),
	Router = require('react-router'),
	RouterHandler = Router.RouteHandler,
	Location = Router.HistoryLocation;

var Modal = React.createClass({
	closeModal: function() {
		Location.pop();
	},

	componentDidMount: function() {
		document.getElementById("uploadBtn").onchange = function () {
			document.getElementById("uploadFile").value = this.value;
		};
	},

	render: function() {
		return (
			<div className="modalDialog">
				<div className="row">
					<div onClick={this.closeModal} title="Close" className="close">X</div>
					<form>
						<legend><h1>Upload Document</h1></legend>
						<div className="row">
							<div className="two fourths padded">
								<input type="text" placeholder="Document Name"/>
							</div>
							<div className="two fourths padded">
								<span className="select-wrap">
									<select>
										<option value disabled selected> Document Type </option>
										<option value="Tax Document">Tax Document</option>
										<option value="Income Document">Income Document</option>
										<option value="Identity Document">Identity Document</option>
									</select>
								</span>
							</div>
						</div>
						<div className="row">
							<div className="two fourths padded">
								<input id="uploadFile" type="text" placeholder="Choose File"/>
							</div>
							<div className="one fourth padded upload">
								<div className="fileUpload button blue gap-right gap-bottom">
									<span>Upload</span>
									<input id="uploadBtn" type="file" className="upload" />
								</div>
							</div>
						</div>
					</form>
				</div>
				<RouterHandler/>
			</div>
		);
	}
});

module.exports = Modal;