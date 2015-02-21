var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var _ = require('lodash');

var calculateTabSpacing = function(tabNavLength){
    return "";
    switch (tabNavLength){
        case 2:
            return "col-xs-6";
        case 3:
            return "col-xs-4";
        case 4:
            return "col-xs-3";
        case 5:
            return "col-xs-2";
        case 6:
            return "col-xs-2";
        case 7:
            return "col-xs-1";
        case 8:
            return "col-xs-1";
        case 9:
            return "col-xs-1";
        case 10:
            return "col-xs-1";
        case 11:
            return "col-xs-1";
        case 12:
            return "col-xs-1";
        default:
            return "";
    }
};

var Navigation = React.createClass({

    mixins: [
        Router.State,
        Router.Navigation
    ],

    propTypes: {
        navigationItems: React.PropTypes.array
    },

    getDefaultProps: function(){
        return {
            navigationItems: []
        };
    },

    onClickTab: function(destination, params) {
		if(typeof destination === 'function') {
			destination();
		} else {
		    this.transitionTo(destination, params[0]);
	    }
    },

    render: function() {
        var tabSpacingClass = 'btn btn-md btn-primary';

        var activeTabClass = tabSpacingClass + " btn-info";
        return (
            <ul className="list-inline">
                {this.props.navigationItems.map(function(tab) {
                    if(typeof tab.tabLink.callback === 'function') {
                        return (
                            <li className="btn-group">
                                <button className={tabSpacingClass} onClick={tab.tabLink.callback}>
                                    <span className="plaintext">{tab.tabName}</span>  <i className={tab.icon}></i>
                                </button>
                            </li>
                        );
                    } else if(this.isActive(tab.tabLink.name)){
                        return (
                            <li className="btn-group">
                                <button className={activeTabClass} onClick={this.onClickTab.bind(this, tab.tabLink.name, tab.tabLink.params)}>
                                    <span className="plaintext">{tab.tabName}</span>
                                </button>
                            </li>
                        );
                    } else {
                        return (
                            <li className="btn-group">
                                <button className={tabSpacingClass} onClick={this.onClickTab.bind(this, tab.tabLink.name, tab.tabLink.params)}>
                                    <span className="plaintext">{tab.tabName}</span>  <i className={tab.icon}></i>
                                </button>
                            </li>
                        );
                    }
                }.bind(this))}
            </ul>
        );
    }

});

module.exports = Navigation;
