"use client";
import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data from API
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default UserProfile;
