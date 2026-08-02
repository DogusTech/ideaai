import { getFirestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const db = getFirestore();

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await db.collection('data').get();
      const data = querySnapshot.docs.map((doc) => doc.data());
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}