import { Button, Form, Message } from "semantic-ui-react";

export const Signup = props => (
  <div className="landing_container">
    <h1 className="signup_title">Sign Up</h1>
    <div className="signup_container">
      <Form className="signup_form attached" onSubmit={props.onSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            placeholder="First Name"
            type="text"
            onChange={props.inputsChange}
            name="firstName"
            value={props.firstNameValue}
            autoComplete="given-name"
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            type="text"
            onChange={props.inputsChange}
            name="lastName"
            value={props.lastNameValue}
            autoComplete="family-name"
          />
        </Form.Group>
        <Form.Input
          label="Email"
          placeholder="Email"
          type="email"
          onChange={props.inputsChange}
          name="email"
          value={props.emailValue}
          error={props.emailInvalid}
          autoComplete="email"
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          onChange={props.inputsChange}
          value={props.passwordValue}
          error={props.passwordInvalid}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
          onChange={props.inputsChange}
          value={props.confirmPasswordValue}
          error={props.confirmPasswordInvalid}
        />
        <Form.Select
          label="City"
          onChange={props.inputsChange}
          name="city"
          options={props.cityOptions}
          value={props.cityValue}
        />
        <Button
          className="landing_button"
          type="submit"
          disabled={
            props.emailInvalid ||
            props.passwordInvalid ||
            props.confirmPasswordInvalid ||
            (!props.firstNameValue ||
              (props.firstNameValue && props.firstNameValue.length < 2)) ||
            (!props.lastNameValue ||
              (props.lastNameValue && props.lastNameValue.length < 2)) ||
            (!props.emailValue ||
              (props.emailValue && props.emailValue.length < 2)) ||
            (!props.passwordValue ||
              (props.passwordValue && props.passwordValue.length < 2)) ||
            (!props.confirmPasswordValue ||
              (props.confirmPasswordValue &&
                props.confirmPasswordValue.length < 2)) ||
            (!props.cityValue ||
              (props.cityValue && props.cityValue.length < 2))
          }
        >
          Sign Up
        </Button>
        <Button
          className="landing_button left floated"
          onClick={props.loadLandingClick}
        >
          Back
        </Button>
      </Form>
      {props.signupError != "" && (
        <Message error attached="bottom">
          {(props.signupError.includes("duplicate") && (
            <>
              Account already made with this email, please{" "}
              <a onClick={props.loginClick}>login</a>{" "}
            </>
          )) ||
            props.signupError}
        </Message>
      )}
    </div>
  </div>
);
