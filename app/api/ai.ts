import { GetServerSideProps } from 'next';
import { AiLandingPage } from '@/components/ui/AiLandingPage';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default AiLandingPage;