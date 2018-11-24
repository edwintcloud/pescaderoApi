import React, { Component } from "react";
import {
  Dropdown,
  Image,
  Menu,
} from "semantic-ui-react";
import axios from "axios";
import { removeCookie } from "tiny-cookie";
import { connect } from "react-redux";
import IssueIcon from "../assets/images/warning-sign.png";

class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }
  logout() {
    axios
      .post("/api/users/logout", { withCredentials: true })
      .then(res => {
        removeCookie("session");
        window.location = "/";
      })
      .catch(err => {
        removeCookie("session");
        window.location = "/";
      });
  }

  render() {
    const trigger = (
      <span>
        <Image avatar src="https://via.placeholder.com/100" />
      </span>
    );

    return (
      <Menu
        secondary
        fixed="top"
        style={{ boxShadow: "0px 1px 10px -1px rgba(0,0,0,0.75)", zIndex:'150' }}
      >
        <Menu.Item header>
          <Image size="mini" src={IssueIcon} className="mr-3" />
          Project Pescadero
        </Menu.Item>
        <Menu.Menu>
          <div className="ui right aligned category search item">
            <div className="ui transparent icon input">
              <input
                className="prompt"
                type="text"
                placeholder="Search issues..."
              />
              <i className="search link icon" />
            </div>
            <div className="results" />
          </div>
        </Menu.Menu>
        <Dropdown item trigger={trigger} simple className="right">
          <Dropdown.Menu>
            <Dropdown.Header>{this.props.user.firstName}</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Header>Issues Opened: 15</Dropdown.Header>
            <Dropdown.Header>Issues Resolved: 4</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
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

export default connect(mapStateToProps)(NavbarComponent);
