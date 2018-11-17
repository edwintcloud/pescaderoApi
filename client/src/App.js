import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import './App.css';
import Map from './components/Map/map';
import Footer from './components/Footer/footer';
import CreateIssue from './pages/create-issue';
import Index from './pages/index';

class App extends Component {
  render() {
    return (
      <HashRouter> 
      <div>
         <Map></Map>
         <Route exact path="/" component={Index} />
         <Route exact path="/issues/new" component={CreateIssue} />
         <Footer></Footer>
      </div>
      </HashRouter>
    );
  }
}

export default App;
