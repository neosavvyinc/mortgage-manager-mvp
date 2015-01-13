var React = require('react');

var populateAddress = function(){
    this.refs.city.getDOMNode().value = BorrowerStore.getBorrower().city;
    this.refs.state.getDOMNode().value = BorrowerStore.getBorrower().state;
    this.refs.zipCode.getDOMNode().value = BorrowerStore.getBorrower().zipCode;
};

var ApplicantBasic = React.createClass({

    componentWillMount: function(){
        if(this.refs.sameAddress.getDOMNODE().value){
            populateAddress();
        }
    },

    render: function(){

        var showCheckbox = this.props.userType == "coapplicant" ? "one third" : "hidden";

        return (
            <div>
                <h2>{this.props.userType}'s Name</h2>
                <div className="row">
                    <input className="one third" type="text" ref="firstName" placeholder="First Name" />
                    <input className="one third" type="text" ref="middleName" placeholder="Middle Name" />
                    <input className="one third" type="text" ref="lastName" placeholder="Last Name" />
                </div>
                <h2>{this.props.userType}'s Address</h2>
                <div className="row">
                    <input type="text" ref="address" placeholder="address" />
                </div>
                <div className="row">
                    <h2 className="one third">{this.props.userType}'s Contact Information</h2>
                    <input className={showCheckbox} type="checkbox" ref="sameAddress" />
                </div>
                <div className="row">
                    <input className="one third" type="text" ref="city" placeholder="City" />
                    <input className="one third" type="text" ref="state" placeholder="State" />
                    <input className="one third" type="number" ref="zipCode" placeholder="Zip Code" />
                </div>

            </div>
        )
    }
});

module.exports = ApplicantBasic;
