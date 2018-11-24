import React, { Component } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import IssueIcon from "../assets/images/warning-sign.png";
import { connect } from 'react-redux';
import { getIssues, removeIssue } from "../actions/issues";

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      zoom={props.zoom}
      center={{
        lat: props.currentLocation.lat,
        lng: props.currentLocation.lng
      }}
      onClick={function(c) { props.addMarker(c.latLng, this)}}
    >
      {props.isMarkerShown && (
        <Marker
          position={{
            lat: props.currentLocation.lat,
            lng: props.currentLocation.lng
          }}
        />
      )}
      {props.issues.map(issue => (
        <Marker
          position={{
            lat: Number(issue.location.lat),
            lng: Number(issue.location.lng)
          }}
          icon={{
            url: IssueIcon,
            scaledSize: new window.google.maps.Size(40, 40)
          }}
          title={issue.title}
          key={issue._id}
        />
      ))}
    </GoogleMap>
  ))
);

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLatLng: {
        lat: 37.78768,
        lng: -122.41094
      },
      isMarkerShown: false,
      zoom: 13
    };
  }

  showCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        this.setState(prevState => ({
          currentLatLng: {
            ...prevState.currentLatLng,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          isMarkerShown: true,
          zoom: 15
        }))
      );
    }
  };

  componentDidMount() {
    this.props.getIssues("/api/issues");
    this.showCurrentLocation();
  }

  addMarker = (location, map) => {
    const marker = {
      lat: location.lat(),
      lng: location.lng()
    };
    this.setState(prevState => ({
      markers: [...prevState.markers, marker]
    }));
    map.panTo({
      lat: location.lat(),
      lng: location.lng()
    });
  };

  render() {
    if (navigator.onLine) {
      return (
        <div className="map_container">
          <Map
            isMarkerShown={this.state.isMarkerShown}
            currentLocation={this.state.currentLatLng}
            zoom={this.state.zoom}
            markers={this.state.markers}
            addMarker={this.addMarker}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
              process.env.REACT_APP_GOOGLE_MAPS_API_KEY
            }`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `calc(100vh - 57px)` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            draggable={false}
            issues={this.props.issues}
          />
        </div>
      );
    } else {
      return (
        <div className="no_mas_maps">
          <p>
            <span role="img" aria-label="jsx-a11y/accessible-emoji">
              😱
            </span>
          </p>
          <p style={{ fontSize: "20px" }}>
            Oh nooo... did you pay your internet bill? No mas google maps.
          </p>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
      issues: state.issues,
      hasErrored: state.itemsHasErrored,
      isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getIssues: url => dispatch(getIssues(url)),
    removeIssue: index => dispatch(removeIssue(index))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
