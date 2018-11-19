import React, { Component } from 'react';
import Map from '../components/map';

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard_container">
        <Map></Map>
        {this.props.children}
      </div>
    )
  }
}

export default Dashboard;