import React, { Component } from 'react'
import './sidebar.css'

class SidebarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="sidebar_container">
        <div className="top_contributors">
          <div className="contributor_profile_pics">
            <img
              className="contributor_profile_pic"
              src="https://via.placeholder.com/100"
              alt="Contributor"
            />
            <img
              className="contributor_profile_pic"
              src="https://via.placeholder.com/100"
              alt="Contributor"
            />
            <img
              className="contributor_profile_pic"
              src="https://via.placeholder.com/100"
              alt="Contributor"
            />
            <img
              className="contributor_profile_pic"
              src="https://via.placeholder.com/100"
              alt="Contributor"
            />
            <img
              className="contributor_profile_pic"
              src="https://via.placeholder.com/100"
              alt="Contributor"
            />
          </div>

          <p>Top Contributors</p>
        </div>
        <div className="issues_resolved">
          <p>2000 <span style={{color:'red'}}>Issues</span> Resolved</p>
        </div>
        <div className="member_count">
        <p>400 Members</p>
        </div>
        <div className="share_link">
        <p>Share</p>
        <p>https://www.example.com/1234</p>
        </div>
      </div>
    )
  }
}

export default SidebarComponent