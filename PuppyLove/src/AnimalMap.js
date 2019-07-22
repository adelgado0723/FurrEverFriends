import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
require('dotenv').config();

class AnimalMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      // center: {
      //   lat: this.props.location.latitude,
      //   lng: this.props.location.longitude,
      // },
      // zoom: 11,
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    const style = {
      width: '200px',
      height: '300px',
      // marginLeft: 'auto',
      // marginRight: 'auto',
    };
    return (
      <Map
        item
        xs={12}
        style={style}
        google={this.props.google}
        onCLick={this.onMapClick}
        zoom={14}
        initialCenter={{
          lat: this.props.location.latitude,
          lng: this.props.location.longitude,
        }}
      >
        <Marker
          onClick={this.onMarkerClick}
          title={'Animal Location'}
          position={{
            lat: this.props.location.latitude,
            lng: this.props.location.longitude,
          }}
          name={'Animal Location'}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div className="map-container">TESTING MAP DIV INSIDE INFOWINDOW</div>
        </InfoWindow>
      </Map>
      // <div className="map">
      //   <h2>Location:</h2>
      //   <div className="map-container">
      //     <GoogleMapReact
      //       bootstrapURLKeys={{ key: process.env.GOOGLE_API_KEY }}
      //       defaultCenter={this.state.center}
      //       defaultZoom={this.state.zoom}
      //     >
      //       <AnyReactComponent
      //         lat={this.state.center.lat}
      //         lng={this.state.center.lng}
      //         text="test"
      //       />
      //     </GoogleMapReact>
      //   </div>
      // </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_API_KEY,
})(AnimalMap);
