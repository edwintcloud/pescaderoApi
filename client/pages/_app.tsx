import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ContextProvider } from '../components';
import '../assets/styles.scss';

export default class MyApp extends App {
  public render(): JSX.Element {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Head>
          <title>Project Pescadero</title>
        </Head>
        <ContextProvider initialState={{}}>
          <Component {...pageProps} router={router} />
        </ContextProvider>
      </Container>
    );
  }
}
