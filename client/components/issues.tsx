import React from "react";
import { Menu, Button, Card, Image, Icon } from "semantic-ui-react";

export const Issues = props => (
  <>
    {props.user && (
      <>
        <div className="issues_header">
          <span className="ui huge header mx-3 mr-4">Issues</span>
          <span className="ui tiny header">
            {props.openIssues} Open issues. {props.resolvedIssues} Resolved.
          </span>
          <Menu pointing secondary>
            <Menu.Item
              name="all"
              active={props.activeNav === "all"}
              onClick={props.navOnClick}
            />
            <Menu.Item
              name="open"
              active={props.activeNav === "open"}
              onClick={props.navOnClick}
            />
            <Menu.Item
              name="resolved"
              active={props.activeNav === "resolved"}
              onClick={props.navOnClick}
            />
          </Menu>
        </div>
        <div className="issues_cards cards ui">
          {props.issues.map((issue, index) => (
            <Card
              fluid
              key={index}
              id={issue._id}
              tabIndex={index}
              onFocus={data => props.cardClick(issue)}
            >
              <Card.Content>
                {(issue.author.avatar && (
                  <Image
                    floated="right"
                    size="mini"
                    src={issue.author.avatar}
                    circular
                  />
                )) || (
                  <Image
                    floated="right"
                    size="mini"
                    src="https://via.placeholder.com/100"
                    circular
                  />
                )}

                <Card.Header onClick={data => props.cardClick(issue)}>
                  {issue.title}
                </Card.Header>
                <Card.Meta>by: {issue.author.firstName}</Card.Meta>
                <Card.Description>{issue.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                {issue.resolved === "true" &&
                  issue.resolvedBy.firstName !== "" && issue.resolvedBy.lastName !== "" && (
                    <span className="resolved_text">
                      Resolved By: {`${issue.resolvedBy.firstName} ${issue.resolvedBy.lastName}`}
                    </span>
                  )}
                <div className="ui buttons right floated">
                  {props.user._id === issue.author._id && issue.resolved === "false" && (
                    <>
                      <Button
                        animated="vertical"
                        negative
                        onClick={data => props.deleteClick(issue)}
                      >
                        <Button.Content hidden>Delete</Button.Content>
                        <Button.Content visible>
                          <Icon name="trash" />
                        </Button.Content>
                      </Button>
                      <Button
                        animated="vertical"
                        primary
                        onClick={data => props.editClick(issue)}
                      >
                        <Button.Content hidden>Edit</Button.Content>
                        <Button.Content visible>
                          <Icon name="pencil" />
                        </Button.Content>
                      </Button>
                    </>
                  )}
                  {props.user._id !== issue.author._id &&
                    issue.resolved === "false" && (
                      <Button
                        positive
                        onClick={data => props.resolveClick(issue)}
                      >
                        Resolve
                      </Button>
                    )}
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </>
    )}
  </>
);
