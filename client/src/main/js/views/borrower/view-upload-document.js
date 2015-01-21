'use strict';

var React = require('react');

var UploadDocument = React.createClass({
	render: function() {
		return (
			<div className="row">
				<div onClick={this.closeModal} title="Close" className="close">X</div>
				<form>
					<legend><h1>Upload Document</h1></legend>
					<div class="row">
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
					<div class="row">
						<div className="three fourths padded">
							<input type="file" placeholder="File Name"/>
						</div>
						<div className="one fourth padded">
							<button className="blue gap-right gap-bottom">Upload</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
});
