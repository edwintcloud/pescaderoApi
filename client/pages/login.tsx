import React, { useContext } from 'react';
import { NextStatelessComponent } from 'next';
import { Context, Login } from '../components';
import Router from 'next/router';

interface Props {
  context?: any;
  router?: any;
}

// Login on Submit
const loginSubmit = async (context): Promise<void> => {
  try {
    const loginRes = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify(context.state.currentUser),
      credentials: 'include',
    });
    if (!loginRes.ok) {
      throw new Error();
    }
    const loginResData = await loginRes.json();
    if (loginResData.hasOwnProperty('error')) {
      context.setState({ loginError: loginResData.error });
      return;
    }
    const currentUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/current`, {
      credentials: 'include',
    });
    if (!currentUserRes.ok) {
      throw new Error();
    }
    const currentUserResData = await currentUserRes.json();
    await context.setState({ currentUser: currentUserResData, loginOpen: false, loginError: '' });
  } catch (e) {
    console.log(e);
  }
  context.setState({ loginOpen: false, loginError: '' });
};

// Login inputs on change
const loginInputsChange = (e, context): void => {
  // update currentUser state
  context.setState({
    currentUser: {
      ...context.state.currentUser,
      [e.target.name]: e.target.value,
    },
    loginError: '',
  });
};

// Landing Login click
const loadLanding = (context): void => {
  context.setState({
    loginOpen: false,
    signupOpen: false,
    loginError: '',
    signupError: '',
  });
  Router.push('/');
};

// Landing SignUp click
const loadSignup = (context): void => {
  context.setState({
    signupOpen: true,
    loginOpen: false,
    loginError: '',
    signupError: '',
    currentUser: {
      ...context.state.currentUser,
      city: (context.state.cities.length > 0 && context.state.cities[0].value) || '',
    },
  });
  Router.push('/signup');
};

const LoginComponent: NextStatelessComponent<Props> = (props: Props): JSX.Element => {
  const context = useContext(Context);

  // redirect to dashboard if logged in
  if (context.state.currentUser.hasOwnProperty('_id')) {
    props.router.push('/dashboard');
  }

  return (
    <Login
      onSubmit={(): Promise<void> => loginSubmit(context)}
      passwordValue={context.state.currentUser.password}
      emailValue={context.state.currentUser.email}
      inputsChange={(e): void => loginInputsChange(e, context)}
      loginError={context.state.loginError}
      signupClick={(): void => loadSignup(context)}
      loadLandingClick={(): void => loadLanding(context)}
    />
  );
};

export default LoginComponent;
