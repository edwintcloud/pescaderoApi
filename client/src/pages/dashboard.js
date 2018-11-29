import React, { Component } from 'react';
import Map from '../components/map';
import NavbarComponent from '../components/navbar';
import DashboardHome from './dashboard-home';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

class Dashboard extends Component {

  render() {
    if (!this.props.user.hasOwnProperty('firstName')) {
      console.log(this.props.user)
    }
    return (
      <div style={{width:'100%'}}>
        <NavbarComponent />
      <div className="dashboard_container">
        <Map></Map>
        <DashboardHome />
      </div>
      </div>
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
