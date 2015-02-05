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

        var messageClass = 'message gap-bottom';

        switch(this.props.type){
            case 'success':
                messageClass = messageClass + ' success';
                break;
            case 'question':
                messageClass = messageClass + ' question';
                break;
            case 'alert':
                messageClass = messageClass + ' alert';
                break;
            case 'warning':
                messageClass = messageClass + ' warning';
                break;
            default:
                messageClass = messageClass + ' error';
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