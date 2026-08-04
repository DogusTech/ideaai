import { GetServerSideProps } from 'next';
import { AiOutlineDashboard } from "@ant-design/icons";

const AI = () => {
  return (
    <div>
      <h1>AI Dashboard</h1>
      <AiOutlineDashboard style={{ fontSize: 48 }} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}
  };
};

export default AI;