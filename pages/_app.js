import React from 'react';
import '../styles/globals.css';
import TawkToChat from '../components/TawkToChat';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <TawkToChat />
    </>
  );
}

export default MyApp; 