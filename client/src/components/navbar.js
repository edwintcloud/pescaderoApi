import React, { Component } from 'react'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import { removeCookie } from 'tiny-cookie';

class NavbarComponent extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      user : '',
      dropdownOpen: false
    }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  onMouseEnter() {
    this.setState({dropdownOpen: true});
  }

  onMouseLeave() {
    this.setState({dropdownOpen: false});
  }

  componentWillMount(){
    // get current logged in user
    axios.get("http://localhost:5000/users/current", { withCredentials: true }).then(res => {
      if(res.data.hasOwnProperty("_id")) {
        this.setState({user:res.data});
      } else {
        window.location = '/';
      }
    }).catch(err => {
      window.location = '/';
    })
  }

  logout() {
    axios.post("http://localhost:5000/users/logout", { withCredentials: true }).then(res => {
      removeCookie("session");
      window.location = "/";
    }).catch(err => {
      removeCookie("session");
      window.location = '/';
    })
  }

  render() {

    return (
        <Navbar color="light" light expand="md">
      <NavbarBrand href="/"></NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
          <Link to="/dashboard">
            <NavLink>Dashboard</NavLink>
            </Link>
          </NavItem>
          <NavItem>
          <Link to="/dashboard/create-issue">
            <NavLink>Create Issue</NavLink>
            </Link>
          </NavItem>
          <UncontrolledDropdown nav inNavbar onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              {this.state.user.firstName}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                My Issues
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={this.logout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
    </Navbar>
    )
  }
}

export default NavbarComponent