import React, { Component } from 'react';
import Issues from '../components/issues';
import Sidebar from '../components/sidebar';
import Dashboard from'./dashboard';

class DashboardHome extends Component {
  render() {
    return (
      <Dashboard>
        <Issues></Issues>
        <Sidebar></Sidebar>
      </Dashboard>
    )
  }
}

export default DashboardHome;