import React, { Component } from "react";
import { connect } from "react-redux";
import { removeIssue } from "../actions/issues";
import { Menu, Button, Card, Image, Icon } from 'semantic-ui-react';

class Issues extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      activeItem: 'open' 
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

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
        <div>
          <span className='ui huge header mx-3 mr-4'>Issues</span>
          <span className='ui tiny header'>200 Open issues. 4 Resolved.</span>
        </div>
        <Menu pointing secondary>
          <Menu.Item name='open' active={activeItem === 'open'} onClick={this.handleItemClick} />
          <Menu.Item
            name='resolved'
            active={activeItem === 'resolved'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='opened by me'
            active={activeItem === 'opened by me'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='resolved by me'
            active={activeItem === 'resolved by me'}
            onClick={this.handleItemClick}
          />
        </Menu>
        <div className="issues ui centered cards pl-2">
        {this.props.issues.map((issue, index) => (
          <Card fluid>
          <Card.Content>
            <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/steve.jpg' />
            <Card.Header>{issue.title}</Card.Header>
            <Card.Meta>by: {issue.author.firstName}</Card.Meta>
            <Card.Description>
              {issue.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui buttons right floated'>
            {issue.author._id === this.props.user._id &&
            <Button animated='vertical' negative>
              <Button.Content hidden>Delete</Button.Content>
              <Button.Content visible>
                <Icon name='trash' />
              </Button.Content>
            </Button>
            }
            {issue.author._id === this.props.user._id &&
            <Button animated='vertical' primary>
            <Button.Content hidden>Edit</Button.Content>
            <Button.Content visible>
              <Icon name='pencil' />
            </Button.Content>
          </Button>
            }
            <Button positive>
                Resolve
            </Button>
            </div>
          </Card.Content>
        </Card>
        ))}
        </div>
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
    removeIssue: index => dispatch(removeIssue(index))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Issues);
