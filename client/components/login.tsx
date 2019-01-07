import { Button, Form, Message } from "semantic-ui-react";

export const Login = props => (
  <div className="landing_container">
    <h1 className="login_title">Log In</h1>
    <div className="login_container">
      <Form className="login_form attached" onSubmit={props.onSubmit}>
        <Form.Input
          label="Email"
          placeholder="Email"
          type="email"
          onChange={props.inputsChange}
          name="email"
          value={props.emailValue}
          autoComplete="email"
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          onChange={props.inputsChange}
          value={props.passwordValue}
        />

        <Button
          className="landing_button"
          type="submit"
          disabled={
            !props.emailValue ||
            (props.emailValue && props.emailValue.length < 2) ||
            (!props.passwordValue ||
              (props.passwordValue && props.passwordValue.length < 2))
          }
        >
          Login
        </Button>
        <Button
          className="landing_button left floated"
          onClick={props.loadLandingClick}
        >
          Back
        </Button>
      </Form>
      {props.loginError != "" && (
        <Message error attached="bottom">
          {(props.loginError != "not found" && props.loginError) || (
            <>
              Account does not exist, please{" "}
              <a onClick={props.signupClick}>signup</a>{" "}
            </>
          )}
        </Message>
      )}
    </div>
  </div>
);
