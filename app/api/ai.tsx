import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function Home() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const db = getFirestore();
      const docRef = doc(db, "users", "123");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchUserData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}

export default Home;
