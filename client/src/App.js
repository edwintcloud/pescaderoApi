import React, { Component } from 'react';
import './App.css';
import Map from './components/Map/map'
import Footer from './components/Footer/footer'
import Issues from './components/Issues/issues'
import Sidebar from './components/Sidebar/sidebar'

class App extends Component {
  render() {
    return (
      <div className="container">
         <Map></Map>
         <Issues></Issues>
         <Sidebar></Sidebar>
         <Footer></Footer>
      </div>
    );
  }
}

export default App;
