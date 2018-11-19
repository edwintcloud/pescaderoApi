import React, { Component } from 'react';
import NewIssue from '../components/issues-new';
import Dashboard from './dashboard';

class CreateIssue extends Component {
  render() {
    return (
      <Dashboard>
        <NewIssue></NewIssue>
      </Dashboard>
    )
  }
}

export default CreateIssue;