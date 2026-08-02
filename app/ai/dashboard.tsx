import { useState } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';

function Dashboard() {
  const [data, setData] = useState([]);
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setData([...data, 'New data'])}>
        <AiOutlineDashboard size={24} />
      </button>
      <ul>{data.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </div>
  );
}