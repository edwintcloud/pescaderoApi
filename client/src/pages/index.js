import React, { Component } from 'react';
import Issues from '../components/issues';
import Sidebar from '../components/sidebar';

class Index extends Component {
  render() {
    return (
      <div className="container">
        <Issues></Issues>
        <Sidebar></Sidebar>
      </div>
    )
  }
}

export default Index;