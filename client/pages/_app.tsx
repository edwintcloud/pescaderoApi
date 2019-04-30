import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ContextProvider } from '../components';
import '../assets/styles.scss';

const defaultState = {
  currentLocation: {
    lat: 37.78768,
    lng: -122.41094,
  },
  mapCenter: {
    lat: 37.78768,
    lng: -122.41094,
  },
  issues: [],
  currentUser: {},
  issuesNav: 'all',
  currentIssue: {},
  modalOpen: false,
  modalTitle: '',
  currentIssueTitleError: false,
  currentIssueDescError: false,
  loginOpen: false,
  signupOpen: false,
  signupEmailInvalid: false,
  signupPasswordInvalid: false,
  signupConfirmPasswordInvalid: false,
  cities: [],
  loading: true,
  loadingError: '',
  selectedIssue: '',
  messageVisible: true,
  loginError: '',
  signupError: '',
  arrowDirection: 'down',
};

export default class MyApp extends App {
  public render(): JSX.Element {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Head>
          <title>Project Pescadero</title>
        </Head>
        <ContextProvider initialState={defaultState}>
          <Component {...pageProps} router={router} />
        </ContextProvider>
      </Container>
    );
  }
}
