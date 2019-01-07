import React from "react";
import App, { Container } from "next/app";
import Head from 'next/head'
import "../assets/styles.scss";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Project Pescadero</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    );
  }
}
