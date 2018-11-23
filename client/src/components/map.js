import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import IssueIcon from '../assets/images/warning-sign.png';

const Map = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDwrgWKkdd5dT7ftnPaccBM6zgRb5R90g',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `46vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    zoom={props.zoom}
    center={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }}
    onClick={(c) => props.addMarker(c.latLng)}
  >
    {props.isMarkerShown && (
      <Marker
        position={{
          lat: props.currentLocation.lat,
          lng: props.currentLocation.lng,
        }}
      />
    )}
    {
      props.markers.map(marker => <Marker
        position={{
          lat: marker.lat,
          lng: marker.lng,
        }}
        icon={{url:IssueIcon, scaledSize: new window.google.maps.Size(40,40)}}
        title={marker.title}
        />)
    }
  </GoogleMap>
))

class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: 37.78768,
        lng: -122.41094,
      },
      isMarkerShown: false,
      zoom: 13,
      markers: [
        {
          lat: 37.787,
          lng: -122.41095,
          title: "issue 1"
        },
        {
          lat: 37.7871,
          lng: -122.41096,
          title: "issue 2"
        },
        {
          lat: 37.7872,
          lng: -122.41097,
          title: "issue 3"
        },
      ]
    }
  }

  showCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>
        this.setState(prevState => ({
          currentLatLng: {
            ...prevState.currentLatLng,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isMarkerShown: true,
          zoom: 15,
        }))
      )
    }
  }

  componentDidMount() {
    this.showCurrentLocation()
  }

  addMarker = (location) => {
    const marker = {
      lat: location.lat(),
      lng: location.lng()
    }
    this.setState(prevState => ({
      markers: [...prevState.markers, marker]
    }));
  }

  render() {
    if(navigator.onLine) {
      return (
        <div className='map_container'>
          <Map
            isMarkerShown={this.state.isMarkerShown}
            currentLocation={this.state.currentLatLng}
            zoom={this.state.zoom}
            markers={this.state.markers}
            addMarker={this.addMarker}
          />
        </div>
      )
    } else {
      return (
        <div style={{marginTop:'77px', padding:'20px', height:'35vh', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3em', flexDirection:'column', textAlign:'center'}}>
        <p><span role="img" aria-label="jsx-a11y/accessible-emoji">😱</span></p>
        <p style={{fontSize:'20px'}}>Oh nooo... did you pay your internet bill? No mas google maps.</p>
        </div>
      )
    }
    
  }
}

export default MapComponent