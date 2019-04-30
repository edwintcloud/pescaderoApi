import { Button } from 'semantic-ui-react';
import React from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  loginClick?: React.MouseEventHandler;
  signupClick?: React.MouseEventHandler;
}

export const Landing = (props: Props): JSX.Element => (
  <div className="landing_container">
    <h1 className="landing_title">{props.title}</h1>
    <h3 className="landing_subtitle">{props.subtitle}</h3>
    <hr />
    <div className="landing_buttons">
      <Button className="landing_button" onClick={props.loginClick}>
        Log In
      </Button>
      <Button className="landing_button" onClick={props.signupClick}>
        Sign Up
      </Button>
    </div>
  </div>
);
