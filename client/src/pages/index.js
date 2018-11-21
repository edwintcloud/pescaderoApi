import React, { Component } from "react";
import { Jumbotron, Button } from 'reactstrap';
import { Link } from "react-router-dom";

class Index extends Component {

  constructor(props) {
    super(props)
    this.state ={}
  }

  render() {
    return (
      <div>
       <Jumbotron className="jumbo">
        <h1 className="display-3">Project Pescadero</h1>
        <p className="lead mb-0">Changing the world, one small act of kindness at a time.</p>
        <hr className="my-2 mb-3" style={{width:'300px'}}/>
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

export default Index;
