import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailInvalid: false,
      passwordInvalid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ passwordInvalid: false });
    this.setState({ passwordInvalid: false });
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    axios
      .post("https://project-pescadero.herokuapp.com/api/users/login", this.state, { withCredentials: true })
      .then(res => {
        if (res.data.hasOwnProperty("error")) {
          console.log(res.data.error)
          if (res.data.error.includes("password")) {
            this.setState({ passwordInvalid: true });
          } else {
            this.setState({ emailInvalid: true });
          } 
        } else {
          window.location = "/dashboard";
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h1 className="display-4 mt-3 text-center">Login</h1>
        <Card className="my-3 mx-3 mb-5">
          <CardBody style={{minWidth:'30vw'}}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  invalid={this.state.emailInvalid}
                />
                <FormFeedback id="email-feedback" invalid>
                Email not registered! Please <a href="/signup">sign up</a>
                </FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  invalid={this.state.passwordInvalid}
                />
                <FormFeedback id="password-feedback" invalid>
                Password incorrect!
                </FormFeedback>
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                style={{ float: "right" }}
                disabled={
                  this.state.emailInvalid ||
                  this.state.passwordInvalid ||
                  this.state.email === "" ||
                  this.state.password === ""
                }
              >
                Log In
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Login;
