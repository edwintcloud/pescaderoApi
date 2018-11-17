import React, { Component } from 'react';
import NewIssue from '../components/NewIssue/issues-new';

class CreateIssue extends Component {
  render() {
    return (
      <div className="container">
        <NewIssue></NewIssue>
      </div>
    )
  }
}

export default CreateIssue;