import React, { Component } from 'react'
import { compose, withProps } from 'recompose'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'

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
  >
    {props.isMarkerShown && (
      <Marker
        position={{
          lat: props.currentLocation.lat,
          lng: props.currentLocation.lng,
        }}
      />
    )}
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

  render() {
    return (
      <div className='map_container'>
        <Map
          isMarkerShown={this.state.isMarkerShown}
          currentLocation={this.state.currentLatLng}
          zoom={this.state.zoom}
        />
      </div>
    )
  }
}

export default MapComponent