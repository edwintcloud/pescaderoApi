import React, { Component } from 'react';
import Map from '../components/map';
import NavbarComponent from '../components/navbar';
import DashboardHome from './dashboard-home';
import CreateIssue from './dashboard-create-issue';
import { BrowserRouter, Route } from 'react-router-dom';
  
class Dashboard extends Component {

  render() {
    return (
      <BrowserRouter basename="/dashboard">
      <div style={{width:'100%'}}>
        <NavbarComponent />
      <div>
        <Map></Map>
        <Route exact path="/" component={DashboardHome} />
        <Route exact path="/create-issue" component={CreateIssue} />
      </div>
      </div>
      </BrowserRouter>
    )
  }
}

export default Dashboard;