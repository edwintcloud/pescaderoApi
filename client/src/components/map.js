import React, { Component } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import IssueIcon from "../assets/images/warning-sign.png";
import { connect } from 'react-redux';
import { getIssues, removeIssue, addIssue } from "../actions/issues";
import {
  Button,
  Icon,
  Modal,
  Header,
  Form
} from "semantic-ui-react";

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      zoom={props.zoom}
      center={props.center}
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
      {props.issues.map((issue, index) => (
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
          key={index}
          onClick={() => props.markerClick(issue._id)}
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
      zoom: 13,
      modalVisible: false,
      issue: {
        title: '',
        description: '',
        author: this.props.user._id,
        city: this.props.user.city,
        location: {
          lat: '',
          lng: ''
        },
        resolved: "false"
      },
      titleInvalid: false,
      descriptionInvalid: false,
      center: {
        lat: 37.78768,
        lng: -122.41094
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          center: {
            ...prevState.center,
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
    this.props.getIssues(`/api/issues`);
    this.showCurrentLocation();
  }

  addMarker = (location, map) => {
    this.setState({zoom:15})
    this.setState(() => ({
      center:{
        lat: location.lat(),
        lng: location.lng()
      }
    }));
    const marker = {
      lat: String(location.lat()),
      lng: String(location.lng())
    };
    this.setState(prevState => ({
      issue: {
        ...prevState.issue,
        location: marker
      }
    }));
    
    this.showModalCreate();
  };

  markerClick = (id) => {
    this.props.getIssues(`/api/issues?id=${id}`);
  }

  handleChange(event, data) {
    this.setState(prevState => ({
      issue: {
        ...prevState.issue,
        [data.name]: data.value
      }
    }));
    if (data.name === "description") {
      if (data.value.length < 49) {
        this.setState({ descriptionInvalid: true });
      } else {
        this.setState({ descriptionInvalid: false });
      }
    }
    if (data.name === "title") {
      if (data.value.length < 5) {
        this.setState({ titleInvalid: true });
      } else {
        this.setState({ titleInvalid: false });
      }
    }
  }

  handleSubmit() {
    this.props.addIssue(this.state.issue);
    this.props.getIssues(`/api/issues`);
    this.setState({modalVisible:false});
    const count = Number(window.document.getElementById("openIssues").innerHTML);
    window.document.getElementById("openIssues").innerHTML = count+1;
  }

  showModalCreate() {
    if (!this.state.modalVisible) {
      this.setState(prevState => ({
        issue: {
          ...prevState.issue,
          title: '',
          description: ''
        }
      }));
      this.setState({ modalVisible: true });
      this.setState({ descriptionInvalid: false });
      this.setState({ titleInvalid: false });
    }
  }

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
            markerClick={this.markerClick}
            center={this.state.center}
          />
          <Modal open={this.state.modalVisible} className="issue_modal">
          <Header icon="add" content="Create Issue" />
          <Modal.Content>
            <Form>
              <Form.Input
                fluid
                label="Title"
                placeholder="Issue title"
                name="title"
                value={this.state.issue.title}
                onChange={this.handleChange}
                error={this.state.titleInvalid}
              />
              <Form.TextArea
                label="Description"
                placeholder="Issue description..."
                value={this.state.issue.description}
                name="description"
                onChange={this.handleChange}
                error={this.state.descriptionInvalid}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="red"
              onClick={() => this.setState({ modalVisible: false })}
            >
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" disabled={this.state.descriptionInvalid || this.state.titleInvalid || this.state.issue.title === '' || this.state.issue.description === ''} onClick={() => this.handleSubmit()}>
              <Icon name="checkmark" /> Save
            </Button>
          </Modal.Actions>
        </Modal>
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
      user: state.user,
      hasErrored: state.itemsHasErrored,
      isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getIssues: url => dispatch(getIssues(url)),
    removeIssue: (index, id) => dispatch(removeIssue(index, id)),
    addIssue: issue => dispatch(addIssue(issue))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
