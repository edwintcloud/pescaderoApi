import { Button, Icon, Modal, Header, Form } from 'semantic-ui-react';
import React from 'react';

interface Props {
  context: any;
}

// IssuesModal title and description on change method
const currentIssueChange = (data, context): void => {
  if (!context.state.currentIssue.hasOwnProperty('resolved')) {
    context.setState({
      currentIssue: {
        ...context.state.currentIssue,
        resolved: 'false',
      },
    });
  }
  // update current issue state
  context.setState({
    currentIssue: {
      ...context.state.currentIssue,
      resolvedBy: null,
      [data.name]: data.value,
    },
  });
  if (data.name === 'description') {
    if (data.value.length < 5) {
      context.setState({ currentIssueDescError: true });
    } else {
      context.setState({ currentIssueDescError: false });
    }
  } else {
    if (data.value.length < 5) {
      context.setState({ currentIssueTitleError: true });
    } else {
      context.setState({ currentIssueTitleError: false });
    }
  }
};

// IssuesModal Close click
const modalClose = (context): void => {
  context.setState({
    modalOpen: false,
    currentIssueDescError: false,
    currentIssueTitleError: false,
  });
};

// IssuesModal Submit click
const modalSubmit = async (context): Promise<void> => {
  if (context.state.currentIssue.hasOwnProperty('resolved')) {
    // edit issue
    try {
      const editIssueRes = await fetch(`${process.env.BACKEND_URL}/api/issues?id=${context.state.currentIssue._id}`, {
        method: 'PUT',
        body: JSON.stringify(context.state.currentIssue),
      });
      if (!editIssueRes.ok) {
        throw new Error();
      }
      console.log(await editIssueRes.json());
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
  } else {
    // new issue
    const currentIssue = {
      ...context.state.currentIssue,
      resolved: 'false',
    };
    try {
      const newIssueRes = await fetch(`${process.env.BACKEND_URL}/api/issues`, {
        method: 'POST',
        body: JSON.stringify(currentIssue),
      });
      if (!newIssueRes.ok) {
        throw new Error();
      }
      const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
      if (!issuesRes.ok) {
        throw new Error();
      }
      const issuesResData = await issuesRes.json();
      await context.setState({
        issues: issuesResData.reverse(),
      });
      const card = document.querySelector(`.issues_cards > .card[tabindex="0"]`);
      card.scrollIntoView();
      card.parentElement.scrollBy(0, -20);
      (card as any).focus();
      setTimeout((): void => (card as any).blur(), 2000);
    } catch (e) {
      console.log(e);
    }
  }
  context.setState({ modalOpen: false });
};

export const IssuesModal = (props: Props): JSX.Element => (
  <Modal open={props.context.state.modalOpen} className="issues_modal">
    <Header
      icon="pencil"
      content={
        (props.context.state.currentIssue.author !== props.context.state.currentUser._id && 'View Issue') ||
        props.context.state.modalTitle
      }
    />
    <Modal.Content>
      <Form>
        <Form.Input
          fluid
          label="Title"
          placeholder="Issue title"
          name="title"
          value={props.context.state.currentIssue.title}
          onChange={(_, data): void => currentIssueChange(data, props.context)}
          error={props.context.state.currentIssueTitleError}
          disabled={props.context.state.currentIssue.author !== props.context.state.currentUser._id}
        />
        <Form.TextArea
          label="Description"
          placeholder="Issue description..."
          value={props.context.state.currentIssue.description}
          name="description"
          onChange={(_, data): void => currentIssueChange(data, props.context)}
          error={props.context.state.currentIssueDescError}
          disabled={props.context.state.currentIssue.author !== props.context.state.currentUser._id}
        />
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button color="red" onClick={(): void => modalClose(props.context)}>
        <Icon name="remove" /> Cancel
      </Button>
      {props.context.state.currentIssue.author === props.context.state.currentUser._id && (
        <Button
          color="green"
          disabled={
            props.context.state.currentIssueDescError ||
            props.context.state.currentIssueTitleError ||
            props.context.state.currentIssue.title === '' ||
            props.context.state.currentIssue.description === ''
          }
          onClick={(): Promise<void> => modalSubmit(props.context)}
        >
          <Icon name="checkmark" /> Save
        </Button>
      )}
    </Modal.Actions>
  </Modal>
);
