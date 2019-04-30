import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import React from 'react';

interface Props {
  currentLocation?: any;
  onClick?: any;
  issues?: any;
  selectedIssue?: any;
  zoom?: any;
  center?: any;
  markerClick?: any;
  context?: any;
}

// Marker on click
const markerClick = (event, data, context): void => {
  if (data == undefined) {
    const location = {
      lat: String(event.latLng.lat()),
      lng: String(event.latLng.lng()),
    };
    context.setState({
      currentIssue: {
        location: location,
        author: context.state.currentUser._id,
        city: context.state.currentUser.city,
      },
      modalOpen: true,
      modalTitle: 'New Issue',
      selectedIssue: '',
    });
  } else {
    context.setState({
      currentIssue: {
        ...data,
        author: data.author._id,
        city: data.author.city,
      },
      selectedIssue: data._id,
    });
    const card = document.getElementById(data._id);
    card.scrollIntoView();
    card.parentElement.scrollBy(0, -20);
    card.focus();
    setTimeout((): void => card.blur(), 2000);
  }
};

// Add marker to map component
const mapAddMarker = (event, context): void => {
  const location = {
    lat: String(event.lat()),
    lng: String(event.lng()),
  };
  context.setState({
    currentIssue: {
      location: location,
      author: context.state.currentUser._id,
      city: context.state.currentUser.city,
      title: '',
      description: '',
    },
    modalOpen: true,
    modalTitle: 'New Issue',
    selectedIssue: '',
    messageVisible: false,
    currentIssueDescError: false,
    currentIssueTitleError: false,
  });
};

const Markers = (props: Props): JSX.Element => (
  <>
    {props.currentLocation && <Marker position={props.currentLocation} onClick={props.onClick} />}
    {props.issues &&
      props.issues.map(
        (issue, index): JSX.Element => (
          <Marker
            title={issue.title}
            key={index}
            position={{
              lat: Number(issue.location.lat),
              lng: Number(issue.location.lng),
            }}
            icon={
              (props.selectedIssue == issue._id && {
                path: (window as any).google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: 'blue',
                fillColor: 'red',
                fillOpacity: 0.7,
                strokeWeight: 2,
                scale: 7,
              }) || {
                path: (window as any).google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                strokeColor: 'black',
                fillColor: 'red',
                fillOpacity: 0.7,
                strokeWeight: 2,
                scale: 7,
              }
            }
            onClick={(event): void => props.onClick(event, issue)}
          />
        ),
      )}
  </>
);

export const Map = withScriptjs(
  withGoogleMap(
    (props: Props): JSX.Element => (
      <GoogleMap
        zoom={props.zoom}
        center={props.center}
        onClick={(c): void => {
          mapAddMarker(c.latLng, props.context);
        }}
      >
        <Markers
          currentLocation={props.currentLocation}
          issues={props.issues}
          onClick={(e, data): void => markerClick(e, data, props.context)}
          selectedIssue={props.selectedIssue}
        />
      </GoogleMap>
    ),
  ),
);
