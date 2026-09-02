// Import required components
import { useState } from 'react'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return <div>
    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
    <button>Register</button>
  </div>
}
