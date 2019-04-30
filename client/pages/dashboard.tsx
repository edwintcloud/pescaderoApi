import React from 'react';
import { Loader } from 'semantic-ui-react';
import { NavBar, Map, Issues, IssuesModal, Context } from '../components';
import 'isomorphic-unfetch';

interface Props {
  router: any;
}

class DashboardPage extends React.Component<Props, {}> {
  public static contextType = Context;
  public state = this.context.state;

  public getCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position): void => {
          this.context.setState({
            currentLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            mapCenter: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
      );
    }
  };

  public async componentDidMount(): Promise<void> {
    this.getCurrentLocation();
    // initialize state
    this.context.setState({ loading: true });
    this.context.setState({ loadingError: '' });
    this.context.setState({ cities: [] });
    this.context.setState({ issues: [] });
    this.context.setState({ currentUser: {} });

    // fetch data from api and update state
    try {
      const citiesRes = await fetch(`${process.env.BACKEND_URL}/api/cities`);
      const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
      const currentUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/current`, {
        credentials: 'include',
      });
      if (!citiesRes.ok || !issuesRes.ok || !currentUserRes.ok) {
        throw new Error();
      }
      const citiesData = await citiesRes.json();
      const issuesData = (await issuesRes.json()).reverse();
      const currentUser = await currentUserRes.json();
      citiesData.map(
        (i): void => {
          this.context.setState({
            cities: [
              ...this.context.state.cities,
              {
                text: `${i.name}, ${i.state} (${i.country})`,
                value: i._id,
              },
            ],
          });
        },
      );
      this.context.setState({ issues: issuesData });
      this.context.setState({
        openIssues: issuesData.filter((i): boolean => i.resolved === 'false').length,
      });
      this.context.setState({
        resolvedIssues: issuesData.filter((i): boolean => i.resolved === 'true').length,
      });
      this.context.setState({ currentUser: currentUser });
      this.context.setState({ loading: false });
    } catch (e) {
      this.context.setState({ loading: false });
      this.context.setState({
        loadingError: 'Website is currently undergoing maintenance. Please check back later!',
      });
    }
  }

  public render(): JSX.Element {
    // Render page conditionally
    if (this.context.state.loading) {
      return (
        <div className="landing_container">
          <Loader active inline="centered" />
          <p style={{ marginTop: '10px' }}>Loading please wait...</p>
        </div>
      );
    } else if (this.context.state.loadingError && !this.context.state.loading) {
      return (
        <div className="landing_container">
          <h1 style={{ color: 'red', textAlign: 'center' }}>{this.context.state.loadingError}</h1>
        </div>
      );
    } else if (!this.context.state.currentUser.hasOwnProperty('_id')) {
      this.props.router.push('/');
    } else {
      return (
        <div className="base_container">
          <NavBar context={this.context} />
          <div className="map_container">
            {navigator.onLine && (
              <Map
                googleMapURL={process.env.GOOGLE_MAPS_URL}
                loadingElement={<div className="map" />}
                containerElement={<div className="map" />}
                mapElement={<div className="map" />}
                zoom={15}
                center={this.context.state.mapCenter}
                currentLocation={this.context.state.currentLocation}
                issues={
                  (this.context.state.issuesNav == 'all' && this.context.state.issues) ||
                  (this.context.state.issuesNav == 'open' &&
                    this.context.state.issues.filter(i => i.resolved === 'false')) ||
                  (this.context.state.issuesNav == 'resolved' &&
                    this.context.state.issues.filter(i => i.resolved === 'true'))
                }
                selectedIssue={this.context.state.selectedIssue}
                context={this.context}
              />
            )}
          </div>
          <div className="issues_container">
            <Issues
              issues={
                (this.context.state.issuesNav == 'all' && this.context.state.issues) ||
                (this.context.state.issuesNav == 'open' &&
                  this.context.state.issues.filter(i => i.resolved === 'false')) ||
                (this.context.state.issuesNav == 'resolved' &&
                  this.context.state.issues.filter(i => i.resolved === 'true'))
              }
              activeNav={this.context.state.issuesNav}
              openIssues={this.context.state.issues.filter(i => i.resolved === 'false').length}
              resolvedIssues={this.context.state.issues.filter(i => i.resolved === 'true').length}
              context={this.context}
            />
          </div>
          <div className="issues_modal">
            <IssuesModal context={this.context} />
          </div>
        </div>
      );
    }
    return null;
  }
}

export default DashboardPage;
