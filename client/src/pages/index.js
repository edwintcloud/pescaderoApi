import React, { Component } from 'react';
import Issues from '../components/Issues/issues';
import Sidebar from '../components/Sidebar/sidebar';

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