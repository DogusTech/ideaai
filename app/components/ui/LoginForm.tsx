// Import required components
import { useState } from 'react'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return <div>
    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
    <button>Login</button>
  </div>
}
