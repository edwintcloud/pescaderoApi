import React, { Component } from 'react';
import Map from '../components/map';
import Axios from 'axios';

class Dashboard extends Component {
  
  componentDidMount(){
    // get current logged in user
    Axios.get("http://localhost:5000/users/current", { withCredentials: true }).then(res => {
      console.log(res.data)
    })
  }

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