import React, { Component } from 'react';
import Issues from '../components/issues';
import Sidebar from '../components/sidebar';

class DashboardHome extends Component {
  render() {
    return (
      <div className="dashboard_container">
        <Issues></Issues>
        <Sidebar></Sidebar>
      </div>
    )
  }
}

export default DashboardHome;