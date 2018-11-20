import React, { Component } from 'react';
import Map from '../components/map';
import NavbarComponent from '../components/navbar';
  
class Dashboard extends Component {

  render() {
    return (
      <div style={{width:'100%'}}>
        <NavbarComponent />
      <div className="dashboard_container">
        <Map></Map>
        {this.props.children}
      </div>
      </div>
    )
  }
}

export default Dashboard;