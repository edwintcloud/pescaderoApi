import React from 'react';
import { Menu, Button, Card, Image, Icon } from 'semantic-ui-react';

interface Props {
  user?: any;
  openIssues?: any;
  resolvedIssues?: any;
  activeNav?: any;
  navOnClick?: any;
  issues?: Record<string, any>[];
  cardClick?: any;
  deleteClick?: any;
  editClick?: any;
  resolveClick?: any;
  context: any;
}

// Issues NavBar onClick method
const issuesNavClick = (e, context): void => {
  console.log(e);
  context.setState({
    issuesNav: e.name,
    selectedIssue: '',
  });
};

// Issues edit button on click
const issuesEditClick = (data, context): void => {
  context.setState({
    currentIssue: {
      ...data,
      author: data.author._id,
      city: data.author.city,
    },
    modalOpen: true,
    modalTitle: 'Edit Issue',
    selectedIssue: '',
  });
};

// Issues card on click
const issuesCardClick = (data, context): void => {
  console.log(context);
  context.setState({
    selectedIssue: data._id,
    mapCenter: {
      lat: Number(data.location.lat),
      lng: Number(data.location.lng),
    },
  });
};

// Delete issue on click
const issuesDeleteClick = async (data, context): Promise<void> => {
  if (confirm(`Are you sure you want to delete the issue ${data.title}?`)) {
    try {
      const issuesDelRes = await fetch(`${process.env.BACKEND_URL}/api/issues?id=${data._id}`, {
        method: 'DELETE',
      });

      if (!issuesDelRes.ok) {
        throw new Error();
      }
      const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
      if (!issuesRes.ok) {
        throw new Error();
      }
      const issuesResData = await issuesRes.json();
      context.setState({
        issues: issuesResData.reverse(),
      });
    } catch (e) {
      console.log(e);
    }
  }
};

// resolve issue button click
const issuesResolveClick = async (data, context): Promise<void> => {
  console.log(data);
  try {
    const currentIssue = {
      ...data,
      author: data.author._id,
      city: data.city._id,
      resolved: 'true',
      resolvedBy: context.state.currentUser._id,
    };
    const issuesUpdateRes = await fetch(`${process.env.BACKEND_URL}/api/issues?id=${data._id}`, {
      method: 'PUT',
      body: JSON.stringify(currentIssue),
    });
    if (!issuesUpdateRes.ok) {
      throw new Error();
    }
    const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
    if (!issuesRes.ok) {
      throw new Error();
    }
    const issuesResData = await issuesRes.json();
    context.setState({
      issues: issuesResData.reverse(),
    });
  } catch (e) {
    console.log(e);
  }
};

export const Issues = (props: Props): JSX.Element => (
  <>
    {props.context.state.currentUser && (
      <>
        <div className="issues_header">
          <span className="ui huge header mx-3 mr-4">Issues</span>
          <span className="ui tiny header">
            {props.openIssues} Open issues. {props.resolvedIssues} Resolved.
          </span>
          <Menu pointing secondary>
            <Menu.Item
              name="all"
              active={props.activeNav === 'all'}
              onClick={(_, e): void => issuesNavClick(e, props.context)}
            />
            <Menu.Item
              name="open"
              active={props.activeNav === 'open'}
              onClick={(_, e): void => issuesNavClick(e, props.context)}
            />
            <Menu.Item
              name="resolved"
              active={props.activeNav === 'resolved'}
              onClick={(_, e): void => issuesNavClick(e, props.context)}
            />
          </Menu>
        </div>
        <div className="issues_cards cards ui">
          {props.issues &&
            props.issues.map(
              (issue, index): JSX.Element => (
                <Card
                  fluid
                  key={index}
                  id={issue._id}
                  tabIndex={index}
                  onFocus={(): void => issuesCardClick(issue, props.context)}
                >
                  <Card.Content>
                    {(issue.author.avatar && (
                      <Image floated="right" size="mini" src={issue.author.avatar} circular />
                    )) || <Image floated="right" size="mini" src="https://via.placeholder.com/100" circular />}

                    <Card.Header onClick={(): void => issuesCardClick(issue, props.context)}>{issue.title}</Card.Header>
                    <Card.Meta>by: {issue.author.firstName}</Card.Meta>
                    <Card.Description>{issue.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    {issue.resolved === 'true' &&
                      issue.resolvedBy.firstName !== '' &&
                      issue.resolvedBy.lastName !== '' && (
                        <span className="resolved_text">
                          Resolved By: {`${issue.resolvedBy.firstName} ${issue.resolvedBy.lastName}`}
                        </span>
                      )}
                    <div className="ui buttons right floated">
                      {props.context.state.currentUser._id === issue.author._id && issue.resolved === 'false' && (
                        <>
                          <Button
                            animated="vertical"
                            negative
                            onClick={(): Promise<void> => issuesDeleteClick(issue, props.context)}
                          >
                            <Button.Content hidden>Delete</Button.Content>
                            <Button.Content visible>
                              <Icon name="trash" />
                            </Button.Content>
                          </Button>
                          <Button
                            animated="vertical"
                            primary
                            onClick={(): void => issuesEditClick(issue, props.context)}
                          >
                            <Button.Content hidden>Edit</Button.Content>
                            <Button.Content visible>
                              <Icon name="pencil" />
                            </Button.Content>
                          </Button>
                        </>
                      )}
                      {props.context.state.currentUser._id !== issue.author._id && issue.resolved === 'false' && (
                        <Button positive onClick={(): Promise<void> => issuesResolveClick(issue, props.context)}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              ),
            )}
        </div>
      </>
    )}
  </>
);
