
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function MyApp({ Component, pageProps, session }: AppProps & { session: Session }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Header />
      <Footer />
    </SessionProvider>
  );
}

export default MyApp;