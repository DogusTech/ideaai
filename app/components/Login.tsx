import { NextPage } from 'next'
import { firebaseAdmin } from '../firebase-admin'

const Login: NextPage = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [userId, setUserId] = React.useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email, password }),
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm">
      <h1 className="text-4xl font-bold text-gray-900">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login