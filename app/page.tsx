import { NextPage } from 'next'; import Head from 'next/head'; import Layout from '@/components/ui/Layout'; import Button from '@/components/ui/Button'; import Input from '@/components/ui/Input'; import Typography from '@/components/ui/Typography';

const Login: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
        <Typography variant="h2" className="text-3xl font-bold mb-4">Login</Typography>
        <form>
          <Input type="email" placeholder="Email" className="mb-4" />
          <Input type="password" placeholder="Password" className="mb-4" />
          <Button variant="primary" className="w-full">Login</Button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
