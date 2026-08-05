import { GetServerSideProps } from 'next/dist/next-server/server/api-utils';
import { AiRouter } from '../components/ui/AiRouter';

export default function Ai() {
  return <AiRouter />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
}