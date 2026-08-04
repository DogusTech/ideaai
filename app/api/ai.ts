import { GetServerSideProps } from 'next';
import { Firestore } from 'firebase/firestore';

const db = new Firestore();

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await db.collection('users').get();
  const usersData = users.docs.map((doc) => doc.data());
  return {
    props: {
      usersData,
    },
  };
};

export default function AI() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur shadow-md rounded-md">
      <h1>AI</h1>
      <ul>
        {usersData.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};