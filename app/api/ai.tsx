import { GetServerSideProps } from 'next';
import { Ai } from '@/components/ui/Ai';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Ai;