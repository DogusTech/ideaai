import { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';

function Dashboard() {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">
        <AiOutlineUser size={20} color="#333" />
      </button>
    </form>
  );
}
