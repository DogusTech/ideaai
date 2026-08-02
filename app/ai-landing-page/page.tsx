import { useState } from 'react';
import { Header } from './components/header';

export const LandingPage = () => {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div>
      <Header />
      <input type="text" value={username} onChange={handleUsernameChange} />
    </div>
  );
};