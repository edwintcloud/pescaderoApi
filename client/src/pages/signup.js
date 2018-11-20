import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Col,
  Row
} from "reactstrap";
import axios from 'axios';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: 'San Francisco',
      emailInvalid: false,
      passwordInvalid: false,
      confirmPasswordInvalid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    document.getElementById('email-feedback').innerHTML = `Please enter a valid email address!`;
    this.setState({[e.target.name]: e.target.value});
    if(e.target.name === 'email') {
      if (/.+@.+\..+/.test(e.target.value)) {
        this.setState({emailInvalid: false});
      } else {
        this.setState({emailInvalid: true});
      }
    }
    if(e.target.name === 'password'){
      if(e.target.value.length > 5) {
        this.setState({passwordInvalid: false});
      } else {
        this.setState({passwordInvalid: true});
      }
    }
    if(e.target.name === 'confirmPassword'){
      const password = document.querySelector("[name='password']").value;
      if(e.target.value === password) {
        this.setState({confirmPasswordInvalid: false});
      } else {
        this.setState({confirmPasswordInvalid: true});
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post('/users', this.state).then(res => {
      if('error' in res.data) {
        this.setState({emailInvalid:true});
        document.getElementById('email-feedback').innerHTML = `Email already registered! Please <a href="#/login">login</a>`;
      } else {
        window.location = "#/dashboard";
      }
    }).catch(err => {
      console.log(err);
    });
    // fetch('http://localhost:5000/users', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: this.state
    // }).then(res => res.body).then(body => {
    //   console.log(res)
    //   console.log(JSON.stringify(res.body))
      // if(res.hasOwnProperty('error')) {
      //   // handle error
      //   alert(JSON.stringify(res))
      // } else {
      //   window.location = "#/dashboard";
      // }
    // })
  }

  render() {
    return (
      <div>
          <h1 className="display-4 mt-3 text-center">Sign Up</h1>
          <Card className="my-3 mx-3 mb-5">
            <CardBody>
              <Form onSubmit={this.handleSubmit}>
                <Row form>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="firstName">First Name</Label>
                      <Input type="text" name="firstName" id="firstName" value={this.state.firstName} onChange={this.handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lastName">Last Name</Label>
                      <Input type="text" name="lastName" id="lastName" value={this.state.lastName} onChange={this.handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} invalid={this.state.emailInvalid}/>
                  <FormFeedback id="email-feedback" invalid>Please enter a valid email address!</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} invalid={this.state.passwordInvalid}/>
                  <FormFeedback invalid visible>Password must be at least 6 characters!</FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input type="password" name="confirmPassword" id="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} invalid={this.state.confirmPasswordInvalid}/>
                  <FormFeedback invalid>Passwords must match!</FormFeedback>
                </FormGroup>
                <FormGroup>
          <Label for="city">City</Label>
          <Input type="select" name="city" id="city" value={this.state.city} onChange={this.handleChange} disabled>
            <option value="San Francisco">San Francisco</option>
          </Input>
        </FormGroup>
                <Button  type='submit' color="primary" style={{ float: "right" }} disabled={this.state.emailInvalid || this.state.passwordInvalid || this.state.confirmPasswordInvalid || this.state.email === '' || this.state.password === '' || this.state.confirmPassword === '' || this.state.firstName === '' || this.state.lastName === ''}>
                  Create Account
                </Button>
              </Form>
            </CardBody>
          </Card>
      </div>
    );
  }
}

export default SignUp;
