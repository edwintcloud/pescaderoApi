import React, { Component } from 'react';
import Issues from '../components/issues';
import Sidebar from '../components/sidebar';

class DashboardHome extends Component {
  render() {
    return (
      <div>
        <Issues></Issues>
      </div>
    )
  }
}

export default DashboardHome;