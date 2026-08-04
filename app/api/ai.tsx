import { GetServerSideProps } from 'next';
import AiLandingPage from '@/pages/ai';

export default function Ai() {
  return <AiLandingPage />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};