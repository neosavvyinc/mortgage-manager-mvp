var React = require('react'),
    GoogleMaps = require("react-google-maps");

var GoogleMapsMixin = GoogleMaps.GoogleMapsMixin,
    GoogleMapMarker = GoogleMaps.Marker,
    GoogleMap       = GoogleMaps.Map;

var HeaderLogout = require('../components/header-logout');

var Contact = React.createClass({

    mixins: [
        GoogleMapsMixin
    ],

    getInitialState: function() {
        return {
            googleMapsApi: google.maps,
            latitude: 40.74815,
            longitude: -73.98434
        };
    },

    render: function(){

        var location = new google.maps.LatLng(this.state.latitude, this.state.longitude);
        var markers = [
            <GoogleMapMarker
                position={{lat: 40.74815, lng: -73.98434}}
                key='ShuffleDoc HQ'
                animation={google.maps.Animation.DROP}
            />
        ];

        return (
            <div>
                <div className="header">
                    <HeaderLogout />
                </div>
                <div className="content-body">
                    <div className="content-body container">
                        <div className="panel panel-default bg-white">
                            <div className="panel-body no-pad-bottom">
                                <h2 className="bordered-bottom col-xs-12">Contact Us</h2>
                            </div>
                            <div className="row triple-gap-bottom">
                                <div className="col-sm-4 text-right hidden-xs contact-info">
                                    <p>Corporate Headquarters</p>
                                    <p>349 5th Avenue, Suite 412</p>
                                    <p>New York, NY, 10016</p>
                                </div>
                                <div className="col-xs-12 hidden-sm hidden-md hidden-lg triple-gap-top triple-gap-bottom text-center">
                                    <p>Corporate Headquarters</p>
                                    <p>349 5th Avenue, Suite 412</p>
                                    <p>New York, NY, 10016</p>
                                </div>
                                <div className="col-sm-8 col-xs-12" style={{height: "500px"}}>
                                    <div style={{height: "100%"}}>
                                        <GoogleMap googleMapsApi={google.maps} style={{height: '100%', width: '100%'}} zoom={14} center={location} />
                                        {markers}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Contact;
