import { useState } from 'react';
import { AiOutlineRegister } from "@ant-design/icons";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log(username, password);
  };

  return (
    <div>
      <h1>Register</h1>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;