import React, { Component } from 'react';
import Issues from '../components/Issues/issues';

class CreateIssue extends Component {
  render() {
    return (
      <div className="container">
        <Issues></Issues>
      </div>
    )
  }
}

export default CreateIssue;