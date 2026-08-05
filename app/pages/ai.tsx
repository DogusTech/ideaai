import { GetServerSideProps } from 'next';
import CorporateBackground from './CorporateBackground';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

const AIPage = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <CorporateBackground />
      <h1 className="text-3xl font-bold mb-4">AI Landing Page</h1>
      <div className="flex flex-col items-center">
        <LoginPage />
        <RegisterPage />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default AIPage;