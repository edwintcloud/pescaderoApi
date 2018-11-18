import React, { Component } from 'react'

class NewIssue extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="new_issue_container">
        <div className="new_issue_header">Open a <span style={{color:'red'}}>Issue</span></div>
        <div className="issues_card">
          <div className="issue">
            <div className="issue_box">
              <p className="issue_description">
                Recycling on Satoma has not come for pickup in 4 weeks.......
              </p>
            </div>
            
          </div>
          
        </div>
        <div className="btn_box"><button className="create_btn">Post Issue</button></div>
      </div>
    )
  }
}

export default NewIssue