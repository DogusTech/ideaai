import { useState } from 'react';
import { AiOutlineLogin } from "@ant-design/icons";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(username, password);
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;