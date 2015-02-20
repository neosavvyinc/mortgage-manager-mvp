var React = require('react');

var MessageBox = React.createClass({

    getDefaultProps: function(){
        return {
            displayMessage: false,
            message: '',
            type: 'error'
        }
    },

    propTypes: {
        displayMessage: React.PropTypes.bool,
        message: React.PropTypes.string,
        type: React.PropTypes.string
    },

    render: function(){

        var messageClass = 'alert';

        switch(this.props.type){
            case 'success':
                messageClass = messageClass + ' alert-success';
                break;
            case 'info':
                messageClass = messageClass + ' alert-info';
                break;
            case 'warning':
                messageClass = messageClass + ' alert-warning';
                break;
            default:
                messageClass = messageClass + ' alert-danger';
        }

        if(!this.props.displayMessage){
            messageClass = messageClass + ' hidden';
        }

        return (
            <div className={messageClass}>{this.props.message}</div>
        )
    }
});

module.exports = MessageBox;
