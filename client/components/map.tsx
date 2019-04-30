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
}

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
          props.onClick(c.latLng);
        }}
      >
        <Markers
          currentLocation={props.currentLocation}
          issues={props.issues}
          onClick={props.markerClick}
          selectedIssue={props.selectedIssue}
        />
      </GoogleMap>
    ),
  ),
);
