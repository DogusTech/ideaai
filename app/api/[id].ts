import { GetServerSideProps } from 'next/dist/next-server/lib/utils';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}