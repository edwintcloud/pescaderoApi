import React, { Component } from "react";
import { connect } from "react-redux";
import { removeIssue } from "../actions/issues";
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
      activeItem: "open",
      modalVisible: false,
      issue: {}
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleDeleteIssue(index, issue) {
    if (
      window.confirm(`Are you sure you wish to delete issue ${issue.title}?`)
    ) {
      this.props.removeIssue(index, issue._id);
    }
  }

  showModalEdit(issue) {
    if(!this.state.modalVisible) {
      this.setState({issue:issue})
      this.setState({modalVisible:true})
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
      return <p>No issues to display</p>;
    }
    return (
      <div className="issues_container">
        <div style={{ marginBottom: "12px" }}>
          <span className="ui huge header mx-3 mr-4">Issues</span>
          <span className="ui tiny header">200 Open issues. 4 Resolved.</span>
          <Menu pointing secondary>
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

        <div className="issues ui centered cards pl-2">
          {this.props.issues.map((issue, index) => (
            <Card fluid key={issue._id}>
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
                    <Button animated="vertical" primary onClick={() => this.showModalEdit(issue)}>
                      <Button.Content hidden>Edit</Button.Content>
                      <Button.Content visible>
                        <Icon name="pencil" />
                      </Button.Content>
                    </Button>
                  )}
                  {issue.author._id != this.props.user._id && (
                    <Button positive>Resolve</Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
        <Modal
          open={this.state.modalVisible}
          className="issue_modal"
        >
          <Header icon="pencil" content="Edit Issue" />
          <Modal.Content>
          <Form>
          <Form.Input fluid label='Title' placeholder='Issue title' value={this.state.issue.title} />
        <Form.TextArea label='Description' placeholder='Issue description...' value={this.state.issue.description} />
      </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => this.setState({modalVisible:false})}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green">
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
    removeIssue: (index, id) => dispatch(removeIssue(index, id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Issues);
