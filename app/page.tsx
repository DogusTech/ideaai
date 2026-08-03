import { useState } from 'react';
import Link from 'next/link';
import AiLandingPage from '../ai-landing-page/page';

export default function App({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}