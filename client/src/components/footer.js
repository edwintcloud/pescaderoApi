import React, { Component } from 'react'

class FooterComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  render() {

    return (
      <div className="footer_container" style={{ marginBottom: '10px' }}>
        &copy; 2018 Project Pescadero
      </div>
    )
  }
}

export default FooterComponent