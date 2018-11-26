import React, { Component } from "react";
import { connect } from "react-redux";
import { getIssues, removeIssue, updateIssue } from "../actions/issues";
import {
  Menu,
  Button,
  Card,
  Image,
  Icon,
  Modal,
  Header,
  Form
} from "semantic-ui-react";

class Issues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: "all",
      modalVisible: false,
      issue: {
        title: "",
        description: "",
        author: this.props.user._id,
        city: this.props.user.city,
        location: {
          lat: "",
          lng: ""
        },
        resolved: "false"
      },
      titleInvalid: false,
      descriptionInvalid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, data) {
    this.setState(prevState => ({
      issue: {
        ...prevState.issue,
        [data.name]: data.value
      }
    }));
    if (data.name === "description") {
      if (data.value.length < 49) {
        this.setState({ descriptionInvalid: true });
      } else {
        this.setState({ descriptionInvalid: false });
      }
    }
    if (data.name === "title") {
      if (data.value.length < 5) {
        this.setState({ titleInvalid: true });
      } else {
        this.setState({ titleInvalid: false });
      }
    }
  }

  handleSubmit() {
    const data = {
      title: this.state.issue.title,
      description: this.state.issue.description
    };
    this.props.updateIssue(this.state.issue._id, data)
    this.setState({modalVisible:false});
  }

  handleItemClick = (e, { name }) => {
    switch (name) {
      case "all":
        this.props.getIssues(`/api/issues`)
        break;
      case "open":
        this.props.getIssues(`/api/issues?resolved=false`)
        break;
      case "resolved":
        this.props.getIssues(`/api/issues?resolved=true`);
        break;
      case "opened by me":
        console.log("open");
        break;
      case "resolved by me":
        console.log("open");
        break;
      default:
        console.log(name);
    }
    this.setState({ activeItem: name });
  };

  handleDeleteIssue(index, issue) {
    if (
      window.confirm(`Are you sure you wish to delete issue ${issue.title}?`)
    ) {
      this.props.removeIssue(index, issue._id);
    }
  }

  showModalEdit(issue) {
    if (!this.state.modalVisible) {
      this.setState({ issue: issue });
      this.setState({ modalVisible: true });
      this.setState({ descriptionInvalid: false });
      this.setState({ titleInvalid: false });
    }
  }

  render() {
    const { activeItem } = this.state;

    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the issues</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }

    if (!this.props.issues.length) {
      return (
        <div className="issues_container">
        <div style={{ marginBottom: "12px" }}>
          <span className="ui huge header mx-3 mr-4">Issues</span>
          <span className="ui tiny header">200 Open issues. 4 Resolved.</span>
          <Menu pointing secondary>
          <Menu.Item
              name="all"
              active={activeItem === "all"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="open"
              active={activeItem === "open"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="resolved"
              active={activeItem === "resolved"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="opened by me"
              active={activeItem === "opened by me"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="resolved by me"
              active={activeItem === "resolved by me"}
              onClick={this.handleItemClick}
            />
          </Menu>
        </div>
        <p className="ml-4 ui header">No issues to display!</p>
      </div>
      );
    }
    return (
      <div className="issues_container">
        <div style={{ marginBottom: "12px" }}>
          <span className="ui huge header mx-3 mr-4">Issues</span>
          <span className="ui tiny header">200 Open issues. 4 Resolved.</span>
          <Menu pointing secondary>
          <Menu.Item
              name="all"
              active={activeItem === "all"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="open"
              active={activeItem === "open"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="resolved"
              active={activeItem === "resolved"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="opened by me"
              active={activeItem === "opened by me"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="resolved by me"
              active={activeItem === "resolved by me"}
              onClick={this.handleItemClick}
            />
          </Menu>
        </div>

        <div className="issues ui centered cards px-2">
          {this.props.issues.map((issue, index) => (
            <Card fluid key={index}>
              <Card.Content>
                <Image
                  floated="right"
                  size="mini"
                  src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                />
                <Card.Header>{issue.title}</Card.Header>
                <Card.Meta>by: {issue.author.firstName}</Card.Meta>
                <Card.Description>{issue.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui buttons right floated">
                  {issue.author._id === this.props.user._id && (
                    <Button
                      animated="vertical"
                      negative
                      onClick={() => this.handleDeleteIssue(index, issue)}
                    >
                      <Button.Content hidden>Delete</Button.Content>
                      <Button.Content visible>
                        <Icon name="trash" />
                      </Button.Content>
                    </Button>
                  )}
                  {issue.author._id === this.props.user._id && (
                    <Button
                      animated="vertical"
                      primary
                      onClick={() => this.showModalEdit(issue)}
                    >
                      <Button.Content hidden>Edit</Button.Content>
                      <Button.Content visible>
                        <Icon name="pencil" />
                      </Button.Content>
                    </Button>
                  )}
                  {issue.author._id !== this.props.user._id && (
                    <Button positive>Resolve</Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
        <Modal open={this.state.modalVisible} className="issue_modal">
          <Header icon="pencil" content="Edit Issue" />
          <Modal.Content>
            <Form>
              <Form.Input
                fluid
                label="Title"
                placeholder="Issue title"
                name="title"
                value={this.state.issue.title}
                onChange={this.handleChange}
                error={this.state.titleInvalid}
              />
              <Form.TextArea
                label="Description"
                placeholder="Issue description..."
                value={this.state.issue.description}
                name="description"
                onChange={this.handleChange}
                error={this.state.descriptionInvalid}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="red"
              onClick={() => this.setState({ modalVisible: false })}
            >
              <Icon name="remove" /> Cancel
            </Button>
            <Button
              color="green"
              disabled={
                this.state.descriptionInvalid ||
                this.state.titleInvalid ||
                this.state.issue.title === "" ||
                this.state.issue.description === ""
              }
              onClick={() => this.handleSubmit()}
            >
              <Icon name="checkmark" /> Save
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    issues: state.issues,
    user: state.user,
    hasErrored: state.itemsHasErrored,
    isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getIssues: url => dispatch(getIssues(url)),
    removeIssue: (index, id) => dispatch(removeIssue(index, id)),
    updateIssue: (id, updates) => dispatch(updateIssue(id, updates))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Issues);
