import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { mapStyles } from "./mapStyles";

const Markers = props => (
  <>
    {props.currentLocation && (
      <Marker position={props.currentLocation} onClick={props.onClick} />
    )}
    {props.issues &&
      props.issues.map((issue, index) => (
        <Marker
          title={issue.title}
          key={index}
          position={{
            lat: Number(issue.location.lat),
            lng: Number(issue.location.lng)
          }}
          icon={
            props.selectedIssue == issue._id && {
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "blue",
              fillColor: "red",
              fillOpacity: 0.7,
              strokeWeight: 2,
              scale: 7
            } || {
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              strokeColor: "black",
              fillColor: "red",
              fillOpacity: 0.7,
              strokeWeight: 2,
              scale: 7
            }
          }
          onClick={(event, data) => props.onClick(event, issue)}
        />
      ))}
  </>
);

export const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      zoom={props.zoom}
      center={props.center}
      onClick={c => {
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
  ))
);
