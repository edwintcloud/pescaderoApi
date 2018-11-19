import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import './App.css';
import Index from './pages/index';
import DashboardHome from './pages/dashboard-home';
import CreateIssue from './pages/dashboard-create-issue';

class App extends Component {
  render() {
    return (
      <HashRouter> 
      <div>   
         <Route exact path="/" component={Index} />
         <Route exact path="/dashboard" component={DashboardHome} />
         <Route exact path="/dashboard/create-issue" component={CreateIssue} />
      </div>
      </HashRouter>
    );
  }
}

export default App;
