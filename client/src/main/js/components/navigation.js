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

    propTypes: {
        navigationItems: React.PropTypes.array.isRequired
    },

    getInitialState: function(){
        return {
            activeTabNumber: 0 // Starts at array's position 0
        }
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
                    tabLink: "dashboardMain"
                },
                {
                    tabName: "tab3",
                    tabLink: "dashboardMain"
                },
                {
                    tabName: "tab4",
                    tabLink: "dashboardMain"
                },
                {
                    tabName: "tab5",
                    tabLink: "dashboardMain"
                }
            ]
        }
    },

    render: function(){
        var tabSpacingClass = calculateTabSpacing(this.props.navigationItems.length) + "";

        var activeTabClass = tabSpacingClass + " error";

        return (
            <div className="container row">
                <div className="two thirds">
                    <div className="row">
                        {this.props.navigationItems.map(function(tab) {
                            if(_.indexOf(this.props.navigationItems, tab) == this.state.activeTabNumber){
                                return (
                                    <button className={activeTabClass}>
                                        <Link key={tab.tabName} to={tab.tabLink}>{tab.tabName}</Link>
                                    </button>
                                );
                            } else {
                                return (
                                    <button className={tabSpacingClass} onClick={this.changeActive.bind(this, tab)}>
                                        <Link key={tab.tabName} to={tab.tabLink}>{tab.tabName}</Link>
                                    </button>
                                );
                            }
                        }.bind(this))}
                    </div>
                </div>
            </div>
        );
    },

    changeActive: function(tab){
        console.log( _.indexOf(this.props.navigationItems, tab));
       this.setState({
           activeTabNumber: _.indexOf(this.props.navigationItems, tab)
       });
    }

});

module.exports = Navigation;
