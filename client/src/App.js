import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css';
import Index from './pages/index';
import Dashboard from './pages/dashboard';
import SignUp from './pages/signup';
import Login from './pages/login';

class App extends Component {
  render() {
    return (
      <BrowserRouter> 
      <div className="page_container">   
         <Route exact path="/" component={Index} />
         <Route exact path="/signup" component={SignUp} />
         <Route exact path="/login" component={Login} />
         <Route exact path="/dashboard" component={Dashboard} />
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
