import React, { Component } from 'react'

class Issues extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="issues_container">
        <div className="issues_header_card">Issues</div>
        <div className="issues_card">
        <img
              className="issues_card_profile_pic"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
          <div className="issue">
            <div className="issue_box">
              <h2 className="issue_name">Garbage Cleanup</h2>
              <p className="issue_description">
                There's a serious garbage problem forming in my neighborhood.
                Can anyone contact the city and arrange for a cleanup crew to
                come by?
              </p>
            </div>
            <button className="resolve_btn">Resolve</button>
          </div>
        </div>
        <div className="issues_card">
        <img
              className="issues_card_profile_pic"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
          <div className="issue">
            <div className="issue_box">
              <h2 className="issue_name">Garbage Cleanup</h2>
              <p className="issue_description">
                There's a serious garbage problem forming in my neighborhood.
                Can anyone contact the city and arrange for a cleanup crew to
                come by?
              </p>
            </div>
            <button className="resolve_btn">Resolve</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Issues