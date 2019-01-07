import React from "react";
import { Loader } from "semantic-ui-react";
import {
  NavBar,
  Map,
  Issues,
  IssuesModal,
  Landing,
  Login,
  Signup
} from "../components";
import 'isomorphic-unfetch';

interface IProps {}

interface IState {}

class IndexPage extends React.Component<IProps, IState> {
  state = {
    currentLocation: {
      lat: 37.78768,
      lng: -122.41094
    },
    mapCenter: {
      lat: 37.78768,
      lng: -122.41094
    },
    issues: [],
    currentUser: {},
    issuesNav: "all",
    currentIssue: {},
    modalOpen: false,
    modalTitle: "",
    currentIssueTitleError: false,
    currentIssueDescError: false,
    loginOpen: false,
    signupOpen: false,
    signupEmailInvalid: false,
    signupPasswordInvalid: false,
    signupConfirmPasswordInvalid: false,
    cities: [],
    loading: true,
    loadingError: "",
    selectedIssue: "",
    messageVisible: true,
    loginError: "",
    signupError: "",
    arrowDirection: "down"
  };

  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          mapCenter: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      });
    }
  };

  async componentDidMount() {
    this.getCurrentLocation();
    // initialize state
    this.setState({ loading: true });
    this.setState({ loadingError: "" });
    this.setState({ cities: [] });
    this.setState({ issues: [] });
    this.setState({ currentUser: {} });

    // fetch data from api and update state
    try {
      const citiesRes = await fetch(`${process.env.BACKEND_URL}/api/cities`);
      const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
      const currentUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/current`, {
        credentials: "include"
      });
      if (!citiesRes.ok || !issuesRes.ok || !currentUserRes.ok) {
        throw new Error();
      }
      const citiesData = await citiesRes.json();
      const issuesData = (await issuesRes.json()).reverse();
      const currentUser = await currentUserRes.json();
      citiesData.map(i => {
        this.setState({
          cities: [
            ...this.state.cities,
            {
              text: `${i.name}, ${i.state} (${i.country})`,
              value: i._id
            }
          ]
        });
      });
      this.setState({ issues: issuesData });
      this.setState({
        openIssues: issuesData.filter(i => i.resolved === "false").length
      });
      this.setState({
        resolvedIssues: issuesData.filter(i => i.resolved === "true").length
      });
      this.setState({ currentUser: currentUser });
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
      this.setState({
        loadingError:
          "Website is currently undergoing maintenance. Please check back later!"
      });
    }
  }

  render() {
    // Add marker to map component
    const mapAddMarker = event => {
      const location = {
        lat: String(event.lat()),
        lng: String(event.lng())
      };
      this.setState({
        currentIssue: {
          location: location,
          author: this.state.currentUser._id,
          city: this.state.currentUser.city,
          title: "",
          description: ""
        },
        modalOpen: true,
        modalTitle: "New Issue",
        selectedIssue: "",
        messageVisible: false,
        currentIssueDescError: false,
        currentIssueTitleError: false
      });
    };

    // Issues NavBar onClick method
    const issuesNavClick = (e, { name }) => {
      this.setState({
        issuesNav: name,
        selectedIssue: ""
      });
    };

    // IssuesModal title and description on change method
    const currentIssueChange = (event, data) => {
      // update current issue state
      this.setState({
        currentIssue: {
          ...this.state.currentIssue,
          [data.name]: data.value
        }
      });
      if (data.name === "description") {
        if (data.value.length < 5) {
          this.setState({ currentIssueDescError: true });
        } else {
          this.setState({ currentIssueDescError: false });
        }
      } else {
        if (data.value.length < 5) {
          this.setState({ currentIssueTitleError: true });
        } else {
          this.setState({ currentIssueTitleError: false });
        }
      }
    };

    // IssuesModal Close click
    const modalClose = () => {
      this.setState({
        modalOpen: false,
        currentIssueDescError: false,
        currentIssueTitleError: false
      });
    };

    // IssuesModal Submit click
    const modalSubmit = async () => {
      await this.setState({
        currentIssue: {
          ...this.state.currentIssue,
          resolvedBy: null
        }
      });
      if (this.state.currentIssue.hasOwnProperty("resolved")) {
        // edit issue
        try {
          const editIssueRes = await fetch(
            `${process.env.BACKEND_URL}/api/issues?id=${this.state.currentIssue._id}`,
            {
              method: "PUT",
              body: JSON.stringify(this.state.currentIssue)
            }
          );
          if (!editIssueRes.ok) {
            throw new Error();
          }
          const editIssueResData = await editIssueRes.json();
          const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
          if (!issuesRes.ok) {
            throw new Error();
          }
          const issuesResData = await issuesRes.json();
          this.setState({
            issues: issuesResData.reverse()
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        // new issue
        await this.setState({
          currentIssue: {
            ...this.state.currentIssue,
            resolved: "false"
          }
        });
        try {
          const newIssueRes = await fetch(`${process.env.BACKEND_URL}/api/issues`, {
            method: "POST",
            body: JSON.stringify(this.state.currentIssue)
          });
          if (!newIssueRes.ok) {
            throw new Error();
          }
          const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
          if (!issuesRes.ok) {
            throw new Error();
          }
          const issuesResData = await issuesRes.json();
          await this.setState({
            issues: issuesResData.reverse()
          });
          const card = document.querySelector(
            `.issues_cards > .card[tabindex="0"]`
          );
          card.scrollIntoView();
          card.parentElement.scrollBy(0, -20);
          card.focus();
          setTimeout(() => card.blur(), 2000);
        } catch (e) {
          console.log(e);
        }
      }
      this.setState({ modalOpen: false });
    };

    // Landing Login click
    const loadLogin = () => {
      this.setState({
        loginOpen: true,
        signupOpen: false,
        loginError: "",
        signupError: ""
      });
    };

    // Landing Login click
    const loadLanding = () => {
      this.setState({
        loginOpen: false,
        signupOpen: false,
        loginError: "",
        signupError: ""
      });
    };

    // Landing SignUp click
    const loadSignup = () => {
      this.setState({
        signupOpen: true,
        loginOpen: false,
        loginError: "",
        signupError: "",
        currentUser: {
          ...this.state.currentUser,
          city: this.state.cities[0].value
        }
      });
    };

    // Login inputs on change
    const loginInputsChange = (event, data) => {
      // update currentUser state
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          [data.name]: data.value
        },
        loginError: ""
      });
    };

    // Login on Submit
    const loginSubmit = async () => {
      try {
        const loginRes = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
          method: "POST",
          body: JSON.stringify(this.state.currentUser),
          credentials: "include"
        });
        if (!loginRes.ok) {
          throw new Error();
        }
        const loginResData = await loginRes.json();
        if (loginResData.hasOwnProperty("error")) {
          this.setState({ loginError: loginResData.error });
          return;
        }
        const currentUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/current`, {
          credentials: "include"
        });
        if (!currentUserRes.ok) {
          throw new Error();
        }
        const currentUserResData = await currentUserRes.json();
        await this.setState({ currentUser: currentUserResData, loginOpen: false, loginError: "" });
      } catch (e) {
        console.log(e);
      }
      this.setState({ loginOpen: false, loginError: "" });
    };

    // Signup inputs on change
    const signupInputsChange = (event, data) => {
      // update currentUser state
      this.setState({
        currentUser: {
          ...this.state.currentUser,
          [data.name]: data.value
        }
      });

      if (data.name === "email") {
        if (/.+@.+\..+/.test(data.value)) {
          this.setState({ signupEmailInvalid: false });
        } else {
          this.setState({ signupEmailInvalid: true });
        }
      }
      if (data.name === "password") {
        if (data.value.length > 5) {
          this.setState({ signupPasswordInvalid: false });
        } else {
          this.setState({ signupPasswordInvalid: true });
        }
      }
      if (data.name === "confirmPassword") {
        if (data.value === this.state.currentUser.password) {
          this.setState({ signupConfirmPasswordInvalid: false });
        } else {
          this.setState({ signupConfirmPasswordInvalid: true });
        }
      }
    };

    // Signup on Submit
    const signupSubmit = async () => {
      try {
        const signupRes = await fetch(`${process.env.BACKEND_URL}/api/users`, {
          method: "POST",
          body: JSON.stringify(this.state.currentUser),
          credentials: "include"
        });
        if (!signupRes.ok) {
          throw new Error();
        }
        const signupResData = await signupRes.json();
        if (signupResData.hasOwnProperty("error")) {
          this.setState({ signupError: signupResData.error });
          return;
        }
        await loginSubmit();
        this.setState({ signupOpen: false, signupError: "" });
      } catch (e) {
        console.log(e);
      }
    };

    // Logout button on click
    const logoutUser = async () => {
      try {
        const logoutUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/logout`, {
          method: "POST",
          credentials: "include"
        });

        if (!logoutUserRes.ok) {
          throw new Error();
        }
        const currentUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/current`, {
          credentials: "include"
        });
        if (!currentUserRes.ok) {
          throw new Error();
        }
        this.setState({ currentUser: await currentUserRes.json() });
      } catch (e) {
        console.log(e);
      }
    };

    // Marker on click
    const markerClick = (event, data) => {
      if (data == undefined) {
        const location = {
          lat: String(event.latLng.lat()),
          lng: String(event.latLng.lng())
        };
        this.setState({
          currentIssue: {
            location: location,
            author: this.state.currentUser._id,
            city: this.state.currentUser.city
          },
          modalOpen: true,
          modalTitle: "New Issue",
          selectedIssue: ""
        });
      } else {
        this.setState({
          currentIssue: {
            ...data,
            author: data.author._id,
            city: data.author.city
          },
          selectedIssue: data._id
        });
        const card = document.getElementById(data._id);
        card.scrollIntoView();
        card.parentElement.scrollBy(0, -20);
        card.focus();
        setTimeout(() => card.blur(), 2000);
      }
    };

    // Issues edit button on click
    const issuesEditClick = data => {
      this.setState({
        currentIssue: {
          ...data,
          author: data.author._id,
          city: data.author.city
        },
        modalOpen: true,
        modalTitle: "Edit Issue",
        selectedIssue: ""
      });
    };

    // Issues card on click
    const issuesCardClick = data => {
      this.setState({
        selectedIssue: data._id,
        mapCenter: {
          lat: Number(data.location.lat),
          lng: Number(data.location.lng)
        }
      });
    };

    // Dismiss Message action
    const dismissMessage = () => {
      this.setState({ messageVisible: false });
    };

    // Delete issue on click
    const issuesDeleteClick = async data => {
      if (confirm(`Are you sure you want to delete the issue ${data.title}?`)) {
        try {
          const issuesDelRes = await fetch(
            `${process.env.BACKEND_URL}/api/issues?id=${data._id}`,
            {
              method: "DELETE"
            }
          );

          if (!issuesDelRes.ok) {
            throw new Error();
          }
          const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
          if (!issuesRes.ok) {
            throw new Error();
          }
          const issuesResData = await issuesRes.json();
          this.setState({
            issues: issuesResData.reverse()
          });
        } catch (e) {
          console.log(e);
        }
      }
    };

    // resolve issue button click
    const issuesResolveClick = async data => {
      try {
        await this.setState({
          currentIssue: {
            ...data,
            author: data.author._id,
            city: data.city._id,
            resolved: "true",
            resolvedBy: this.state.currentUser._id
          }
        });
        const issuesUpdateRes = await fetch(
          `${process.env.BACKEND_URL}/api/issues?id=${data._id}`,
          {
            method: "PUT",
            body: JSON.stringify(this.state.currentIssue)
          }
        );
        if (!issuesUpdateRes.ok) {
          throw new Error();
        }
        const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
        if (!issuesRes.ok) {
          throw new Error();
        }
        const issuesResData = await issuesRes.json();
        this.setState({
          issues: issuesResData.reverse()
        });
      } catch (e) {
        console.log(e);
      }
    };

    // upload avatar
    const uploadAvatar = async (event) => {
      const file = event.target.files[0]
      try {
        // get base64 from api
        const data = new FormData();
        data.append("avatar", file);
        data.append("name", this.state.currentUser._id);
        data.append("quality", "90");
        const avatarRes = await fetch(
          process.env.PHOTO_API_URL,
          {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${process.env.PHOTO_API_KEY}`,
            },
            body: data
          }
        );
        if (!avatarRes.ok) {
          throw new Error();
        }
        const avatarResData = await avatarRes.json();
        this.setState({
          currentUser: {
            ...this.state.currentUser,
            avatar: avatarResData.base64
          }
        });
        // update user in database
        const updates = {
          avatar: avatarResData.base64
        };
        const userUpdateRes = await fetch(
          `${process.env.BACKEND_URL}/api/users?id=${this.state.currentUser._id}`,
          {
            method: "PUT",
            body: JSON.stringify(updates)
          }
        );
        if (!userUpdateRes.ok) {
          throw new Error();
        }
        // update issues to show new avatar
        const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
        if (!issuesRes.ok) {
          throw new Error();
        }
        const issuesResData = await issuesRes.json();
        this.setState({
          issues: issuesResData.reverse()
        });
      } catch (e) {
        console.log(e);
      }
    };

    // arrow nav on click for mobile
    const arrowClick = () => {
      if(this.state.arrowDirection == "down") {
        window.scroll(0, window.document.body.scrollHeight);
        this.setState({arrowDirection:"up"});
      } else {
        window.scroll(0, 0);
        this.setState({arrowDirection:"down"});
      }
    };

    // Render page conditionally
    if (this.state.loading) {
      return (
        <div className="landing_container">
          <Loader active inline="centered" />
          <p style={{ marginTop: "10px" }}>Loading please wait...</p>
        </div>
      );
    } else if (this.state.loadingError && !this.state.loading) {
      return (
        <div className="landing_container">
          <h1 style={{ color: "red", textAlign:'center' }}>{this.state.loadingError}</h1>
        </div>
      );
    } else if (!this.state.currentUser.hasOwnProperty("_id")) {
      if (this.state.loginOpen) {
        return (
          <Login
            onSubmit={loginSubmit}
            passwordValue={this.state.currentUser.password}
            emailValue={this.state.currentUser.email}
            inputsChange={loginInputsChange}
            loginError={this.state.loginError}
            signupClick={loadSignup}
            loadLandingClick={loadLanding}
          />
        );
      } else if (this.state.signupOpen) {
        return (
          <Signup
            onSubmit={signupSubmit}
            passwordValue={this.state.currentUser.password}
            emailValue={this.state.currentUser.email}
            inputsChange={signupInputsChange}
            emailInvalid={this.state.signupEmailInvalid}
            passwordInvalid={this.state.signupPasswordInvalid}
            confirmPasswordInvalid={this.state.signupConfirmPasswordInvalid}
            firstNameValue={this.state.currentUser.firstName}
            lastNameValue={this.state.currentUser.lastName}
            confirmPasswordValue={this.state.currentUser.confirmPassword}
            cityOptions={this.state.cities}
            signupError={this.state.signupError}
            loginClick={loadLogin}
            cityValue={this.state.currentUser.city}
            loadLandingClick={loadLanding}
          />
        );
      } else {
        return (
          <Landing
            title="Project Pescadero"
            subtitle="Changing the world, one small act of kindness at a time."
            loginClick={loadLogin}
            signupClick={loadSignup}
          />
        );
      }
    } else {
      return (
        <div className="base_container">
          <NavBar
            user={this.state.currentUser}
            logoutClick={logoutUser}
            dismissMessage={dismissMessage}
            messageVisible={this.state.messageVisible}
            fileChanged={uploadAvatar}
            arrowClick={arrowClick}
            arrowDirection={this.state.arrowDirection}
          />
          <div className="map_container">
            {navigator.onLine && (
              <Map
                googleMapURL={process.env.GOOGLE_MAPS_URL}
                loadingElement={<div className="map" />}
                containerElement={<div className="map" />}
                mapElement={<div className="map" />}
                zoom={15}
                center={this.state.mapCenter}
                currentLocation={this.state.currentLocation}
                issues={
                  (this.state.issuesNav == "all" && this.state.issues) ||
                  (this.state.issuesNav == "open" &&
                    this.state.issues.filter(i => i.resolved === "false")) ||
                  (this.state.issuesNav == "resolved" &&
                    this.state.issues.filter(i => i.resolved === "true"))
                }
                onClick={mapAddMarker}
                markerClick={markerClick}
                selectedIssue={this.state.selectedIssue}
              />
            )}
          </div>
          <div className="issues_container">
            <Issues
              issues={
                (this.state.issuesNav == "all" && this.state.issues) ||
                (this.state.issuesNav == "open" &&
                  this.state.issues.filter(i => i.resolved === "false")) ||
                (this.state.issuesNav == "resolved" &&
                  this.state.issues.filter(i => i.resolved === "true"))
              }
              activeNav={this.state.issuesNav}
              navOnClick={issuesNavClick}
              openIssues={
                this.state.issues.filter(i => i.resolved === "false").length
              }
              resolvedIssues={
                this.state.issues.filter(i => i.resolved === "true").length
              }
              user={this.state.currentUser}
              editClick={issuesEditClick}
              cardClick={issuesCardClick}
              deleteClick={issuesDeleteClick}
              resolveClick={issuesResolveClick}
            />
          </div>
          <div className="issues_modal">
            <IssuesModal
              open={this.state.modalOpen}
              title={this.state.modalTitle}
              currentIssue={this.state.currentIssue}
              user={this.state.currentUser}
              issueTitleValueChange={currentIssueChange}
              issueTitleValueError={this.state.currentIssueTitleError}
              issueDescValueChange={currentIssueChange}
              issueDescValueError={this.state.currentIssueDescError}
              cancelClick={modalClose}
              submitClick={modalSubmit}
            />
          </div>
        </div>
      );
    }
  }
}

export default IndexPage;
