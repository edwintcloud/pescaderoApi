import React, { Component } from 'react';
import Map from '../components/map';
import NavbarComponent from '../components/navbar';
import DashboardHome from './dashboard-home';
import CreateIssue from './dashboard-create-issue';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

class Dashboard extends Component {

  render() {
    if (!this.props.user.hasOwnProperty('_id')) {
      return <Redirect to='/' />
    }
    return (
      <BrowserRouter basename="/dashboard">
      <div style={{width:'100%'}}>
        <NavbarComponent />
      <div className="dashboard_container">
        <Map></Map>
        <Route exact path="/" component={DashboardHome} />
        <Route exact path="/create-issue" component={CreateIssue} />
      </div>
      </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    hasErrored: state.usersHasErrored,
    isLoading: state.usersIsLoading
  };
};

export default connect(
  mapStateToProps
)(Dashboard);
