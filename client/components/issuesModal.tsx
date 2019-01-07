import { Button, Icon, Modal, Header, Form } from "semantic-ui-react";

export const IssuesModal = props => (
  <Modal open={props.open} className="issues_modal">
    <Header
      icon="pencil"
      content={
        (props.currentIssue.author !== props.user._id && "View Issue") ||
        props.title
      }
    />
    <Modal.Content>
      <Form>
        <Form.Input
          fluid
          label="Title"
          placeholder="Issue title"
          name="title"
          value={props.currentIssue.title}
          onChange={props.issueTitleValueChange}
          error={props.issueTitleValueError}
          disabled={props.currentIssue.author !== props.user._id}
        />
        <Form.TextArea
          label="Description"
          placeholder="Issue description..."
          value={props.currentIssue.description}
          name="description"
          onChange={props.issueDescValueChange}
          error={props.issueDescValueError}
          disabled={props.currentIssue.author !== props.user._id}
        />
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button color="red" onClick={props.cancelClick}>
        <Icon name="remove" /> Cancel
      </Button>
      {props.currentIssue.author === props.user._id && (
        <Button
          color="green"
          disabled={
            props.issueDescValueError ||
            props.issueTitleValueError ||
            props.currentIssue.title === "" ||
            props.currentIssue.description === ""
          }
          onClick={props.submitClick}
        >
          <Icon name="checkmark" /> Save
        </Button>
      )}
    </Modal.Actions>
  </Modal>
);
