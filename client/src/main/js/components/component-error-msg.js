var React = require('react');

var ErrorMessage = React.createClass({

    getDefaultProps: function(){
        return {
            errorDisplay: false,
            errorMessage: "su"
        }
    },

    propTypes: {
        errorDisplay: React.PropTypes.bool,
        errorMessage: React.PropTypes.string
    },

    render: function(){

        var errorDisplayClass = this.props.errorDisplay ? "error message gap-bottom" : "hidden";

        return (
            <div className={errorDisplayClass}>{this.props.errorMessage}</div>
        )
    }
});

module.exports = ErrorMessage;
