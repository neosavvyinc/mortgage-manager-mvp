var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var _ = require('lodash');

var calculateTabSpacing = function(tabNavLength){
    return "one sixth";
    switch (tabNavLength){
        case 2:
            return "one half";
        case 3:
            return "one third";
        case 4:
            return "one fourth";
        case 5:
            return "one fifth";
        case 6:
            return "one sixth";
        case 7:
            return "one seventh";
        case 8:
            return "one eight";
        case 9:
            return "one ninth";
        case 10:
            return "one tenth";
        case 11:
            return "one eleventh";
        case 12:
            return "one twelfth";
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
            navigationItems: [
                {
                    tabName: "Action1",
                    tabLink: {
                        name:"dashboardApplications",
                        params: []
                    }
                },
                {
                    tabName: "Action2",
                    tabLink: {
                        name: "routeTester",
                        params: []
                    }
                }
            ]
        };
    },

    onClickTab: function(destination, params) {
		if(typeof destination === "function") {
			destination();
		} else {
		    this.transitionTo(destination, params[0]);
	    }
    },

    render: function() {
        var tabSpacingClass = calculateTabSpacing(this.props.navigationItems.length) + ' blue gap-right';

        var activeTabClass = tabSpacingClass + " turquoise";
        return (
            <div className="container">
                <div className="row gap-bottom">
                    {this.props.navigationItems.map(function(tab) {

	                    if(typeof tab.tabLink.callback === "function") {
		                    return (
			                    <button className={tabSpacingClass} onClick={tab.tabLink.callback}>
				                    <span className="plaintext">{tab.tabName}</span>  <i className={tab.icon}></i>
			                    </button>
		                    );
	                    } else if(this.isActive(tab.tabLink.name)){
                            return (
                                <button className={activeTabClass} onClick={this.onClickTab.bind(this, tab.tabLink.name, tab.tabLink.params)}>
                                    <span className="plaintext">{tab.tabName}</span>
                                </button>
                            );
                        } else {
                            return (
                                <button className={tabSpacingClass} onClick={this.onClickTab.bind(this, tab.tabLink.name, tab.tabLink.params)}>
                                    <span className="plaintext">{tab.tabName}</span>  <i className={tab.icon}></i>
                                </button>
                            );
                        }
                    }.bind(this))}
                </div>
            </div>
        );
    }

});

module.exports = Navigation;
