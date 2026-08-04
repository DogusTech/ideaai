import { Link } from 'next/link';
import Login from './Login';
import Register from './Register';

export default function Ai() {
  return (
    <div>
      <h1>AI</h1>
      <Link href='/ai/login'><a>Login</a></Link>
      <Link href='/ai/register'><a>Register</a></Link>
      <Login />
      <Register />
    </div>
  );
}