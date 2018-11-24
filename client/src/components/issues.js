import React, { Component } from "react";
import { connect } from "react-redux";
import { getIssues, removeIssue } from "../actions/issues";

class Issues extends Component {
  componentDidMount() {
    this.props.getIssues("/api/issues");
  }

  render() {
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the issues</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }

    if (!this.props.issues.length) {
      return <p>No issues to display</p>;
    }
    return (
      <div className="issues_container">
        <div className="issues_header_card">Issues</div>
        {this.props.issues.map((issue, index) => (
          <div className="issues_card" key={issue._id}>
          <img
            className="issues_card_profile_pic"
            src="https://via.placeholder.com/150"
            alt="Profile"
          />
          <div className="issue">
            <div className="issue_box">
              <h2 className="issue_name">{issue.title}</h2>
              <p className="issue_description">
                {issue.description}
              </p>
            </div>
            <button className="resolve_btn" onClick={() => this.props.removeIssue(index)}>Resolve</button>
          </div>
        </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    issues: state.issues,
    hasErrored: state.itemsHasErrored,
    isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getIssues: url => dispatch(getIssues(url)),
    removeIssue: index => dispatch(removeIssue(index))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Issues);
