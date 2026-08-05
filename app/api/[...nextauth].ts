import { GetServerSideProps } from 'next';
import { Firestore } from 'firebase/firestore';

const db = new Firestore();

export default function getServerSideProps() {
  return {
    props: {
      data: db.collection('users').get(),
    },
  };
}