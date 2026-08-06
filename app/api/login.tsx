import { GetServerSideProps } from 'next';
import Login from '../../components/Login';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Login;
