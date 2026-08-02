import { useState } from 'react';
import Link from 'next/link';

function LandingPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name, email);
  };

  return (
    <div>
      <h1>TogetLink AI Landing Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}