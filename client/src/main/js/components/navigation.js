var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var _ = require('lodash');

/*
 NavigationItems array schema:
 {
 tabName: "tab1",
 tabLink: "dashboardMain"
 }
 */

var calculateTabSpacing = function(tabNavLength){
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

    mixins: [Router.State],

    propTypes: {
        navigationItems: React.PropTypes.array
    },

    getDefaultProps: function(){
        return {
            navigationItems: [
                {
                    tabName: "tab1",
                    tabLink: "dashboardMain"
                },
                {
                    tabName: "tab2",
                    tabLink: "dashboardApplicants"
                },
                {
                    tabName: "tab3",
                    tabLink: "dashboardDocuments"
                }
            ]
        }
    },

    render: function(){
        var tabSpacingClass = calculateTabSpacing(this.props.navigationItems.length) + " blue";

        var activeTabClass = tabSpacingClass + " turquoise";

        return (
            <div className="container">
                <div className="row">
                    {this.props.navigationItems.map(function(tab) {
                        if(this.isActive(tab.tabLink)){
                            return (
                                    <Link key={tab.tabName} to={tab.tabLink}>
                                        <button className={activeTabClass}>
                                            <span className="plaintext">{tab.tabName}</span>
                                        </button>
                                    </Link>
                            );
                        } else {
                            return (
                                    <Link key={tab.tabName} to={tab.tabLink}>
                                        <button className={tabSpacingClass}>
                                            <span className="plaintext">{tab.tabName}</span>
                                        </button>
                                    </Link>
                            );
                        }
                    }.bind(this))}
                </div>
            </div>
        );
    }

});

module.exports = Navigation;
