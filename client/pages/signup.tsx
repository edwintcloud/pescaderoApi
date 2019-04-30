import React, { useContext, useEffect } from 'react';
import { NextStatelessComponent } from 'next';
import { Context, Signup } from '../components';
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

// Signup on Submit
const signupSubmit = async (context): Promise<void> => {
  try {
    const signupRes = await fetch(`${process.env.BACKEND_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify(context.state.currentUser),
      credentials: 'include',
    });
    if (!signupRes.ok) {
      throw new Error();
    }
    const signupResData = await signupRes.json();
    if (signupResData.hasOwnProperty('error')) {
      context.setState({ signupError: signupResData.error });
      return;
    }
    await loginSubmit(context);
    context.setState({ signupOpen: false, signupError: '' });
  } catch (e) {
    console.log(e);
  }
};

// Signup inputs on change
const signupInputsChange = (event, data, context): void => {
  // update currentUser state
  context.setState({
    currentUser: {
      ...context.state.currentUser,
      [data.name]: data.value,
    },
  });

  if (data.name === 'email') {
    if (/.+@.+\..+/.test(data.value)) {
      context.setState({ signupEmailInvalid: false });
    } else {
      context.setState({ signupEmailInvalid: true });
    }
  }
  if (data.name === 'password') {
    if (data.value.length > 5) {
      context.setState({ signupPasswordInvalid: false });
    } else {
      context.setState({ signupPasswordInvalid: true });
    }
  }
  if (data.name === 'confirmPassword') {
    if (data.value === context.state.currentUser.password) {
      context.setState({ signupConfirmPasswordInvalid: false });
    } else {
      context.setState({ signupConfirmPasswordInvalid: true });
    }
  }
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

// Landing Login click
const loadLogin = (context): void => {
  context.setState({
    loginOpen: true,
    signupOpen: false,
    loginError: '',
    signupError: '',
  });
  Router.push('/login');
};

const loadCities = async (context): Promise<void> => {
  // fetch data from api and update state
  try {
    const citiesRes = await fetch(`${process.env.BACKEND_URL}/api/cities`);
    if (!citiesRes.ok) {
      throw new Error();
    }
    const citiesData = await citiesRes.json();
    let citiesArray = [];
    citiesData.map(
      (i): number =>
        citiesArray.push({
          text: `${i.name}, ${i.state} (${i.country})`,
          value: i._id,
        }),
    );
    context.setState({ cities: citiesArray });
  } catch (e) {
    context.setState({
      loadingError: 'Website is currently undergoing maintenance. Please check back later!',
    });
  }
};

const SignupComponent: NextStatelessComponent<Props> = (props: Props): JSX.Element => {
  const context = useContext(Context);

  // redirect to dashboard if logged in
  if (context.state.currentUser.hasOwnProperty('_id')) {
    props.router.push('/dashboard');
  }

  useEffect((): void => {
    loadCities(context);
  }, []);

  return (
    <Signup
      onSubmit={(): Promise<void> => signupSubmit(context)}
      passwordValue={context.state.currentUser.password}
      emailValue={context.state.currentUser.email}
      inputsChange={(e, data): void => signupInputsChange(e, data, context)}
      emailInvalid={context.state.signupEmailInvalid}
      passwordInvalid={context.state.signupPasswordInvalid}
      confirmPasswordInvalid={context.state.signupConfirmPasswordInvalid}
      firstNameValue={context.state.currentUser.firstName}
      lastNameValue={context.state.currentUser.lastName}
      confirmPasswordValue={context.state.currentUser.confirmPassword}
      cityOptions={context.state.cities}
      signupError={context.state.signupError}
      loginClick={(): void => loadLogin(context)}
      cityValue={context.state.currentUser.city}
      loadLandingClick={(): void => loadLanding(context)}
    />
  );
};

export default SignupComponent;
