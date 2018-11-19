import React, { Component } from "react";

class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: 'San Francisco'
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    window.location = "#/dashboard";
    const popup = window.open();
    const result = JSON.stringify(this.state);
    popup.document.open();
    popup.document.write(result);
    popup.document.close();
  }

  render() {
    return (
      <div className="landing_container">
        <div className="landing_box">
          <div className="landing_header">Project Pescadero</div>
          <div className="landing_sign_up">
            <form onSubmit={this.handleSubmit}>
              <div className="form_row">
                <label htmlFor="firstName">First Name: </label>
                <input type="text" name="firstName" id="firstName" value={this.state.firstName} onChange={this.handleChange} />
              </div>
              <div className="form_row">
                <label htmlFor="lastName">Last Name: </label>
                <input type="text" name="lastName" id="lastName" value={this.state.lastName} onChange={this.handleChange} />
              </div>
              <div className="form_row">
                <label htmlFor="email">Email: </label>
                <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div className="form_row">
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="form_row">
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={this.state.confirmPassword} onChange={this.handleChange}
                />
              </div>
              <div className="form_row">
                <label htmlFor="city">City :</label>
                <select name="city" id="city" value={this.state.city} onChange={this.handleChange}>
                  <option value="San Francisco">San Francisco</option>
                  <option value="San Jose">San Jose</option>
                </select>
              </div>
              <div className="form_row">
              <label></label>
                <input type="submit" value="Sign Up" />
              </div>              
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
