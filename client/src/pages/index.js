import React, { Component } from "react";
import { Jumbotron, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentUser } from "../actions/users";
import { Redirect } from 'react-router-dom';

class IndexPage extends Component {
  componentDidMount() {
    this.props.fetchData("https://project-pescadero.herokuapp.com/api/users/current");
  }

  render() {
    if (this.props.hasErrored) {
      return (
        <div>
          <Jumbotron className="jumbo">
            <h1 className="display-3">Project Pescadero</h1>
            <p className="lead mb-0">
              Changing the world, one small act of kindness at a time.
            </p>
            <hr className="my-2 mb-3" style={{ width: "300px" }} />
            <p className="lead" style={{color:'red'}}>
              Sorry, our website is currently undergoing maintenance. Please check back soon!
            </p>
          </Jumbotron>
        </div>
      );
    }

    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }

    if ('_id' in this.props.user) {
     return <Redirect to='/dashboard' />
    }
    return (
      <div>
        <Jumbotron className="jumbo">
          <h1 className="display-3">Project Pescadero</h1>
          <p className="lead mb-0">
            Changing the world, one small act of kindness at a time.
          </p>
          <hr className="my-2 mb-3" style={{ width: "300px" }} />
          <p className="lead">
            <Link to="/login">
              <Button color="primary mr-2 px-5">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button color="primary px-5">Sign Up</Button>
            </Link>
          </p>
        </Jumbotron>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    hasErrored: state.usersHasErrored,
    isLoading: state.usersIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(getCurrentUser(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage);
