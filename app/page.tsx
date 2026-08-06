import { GetServerSideProps } from 'next';
import { Layout } from '@/components/ui/Layout';

export default function Home() {
  return (
    <Layout>
      <h1>Welcome to TogetLink AI Landing Page!</h1>
    </Layout>
  );
}