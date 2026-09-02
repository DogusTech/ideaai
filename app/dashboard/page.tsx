"use client";
import { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data from API
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}

export default Dashboard;
