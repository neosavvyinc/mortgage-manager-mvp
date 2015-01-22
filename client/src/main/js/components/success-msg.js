var React = require('react');

var SuccessMessage = React.createClass({

	getDefaultProps: function(){
		return {
			successDisplay: false,
			message: ""
		}
	},

	propTypes: {
		successDisplay: React.PropTypes.bool,
		message: React.PropTypes.string
	},

	render: function(){

		var successDisplayClass = this.props.successDisplay ? "success message gap-bottom" : "hidden";

		return (
			<div className={successDisplayClass}>{this.props.message}</div>
		)
	}
});

module.exports = SuccessMessage;
