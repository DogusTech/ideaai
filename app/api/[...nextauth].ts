<!-- Import necessary components and utilities -->
import { AiLandingPage } from '@/components/ui/AiLandingPage';
import { registerUser } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
import { getServerSideProps } from 'next';

export default function Home() {
  return (
    <AiLandingPage registerUser={registerUser} db={db} />
  );
}

export const getServerSideProps = getServerSideProps();