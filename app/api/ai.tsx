import { useState } from 'react';
import Link from 'next/link';

function Ai() {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(query);
  };

  return (
    <div>
      <h1>Ai</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Query"/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}