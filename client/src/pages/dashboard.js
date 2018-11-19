import React, { Component } from 'react';
import Map from '../components/map';
import Footer from '../components/footer';

class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <Map></Map>
        {this.props.children}
        <Footer></Footer>
      </div>
    )
  }
}

export default Dashboard;