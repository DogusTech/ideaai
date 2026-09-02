import Link from 'next/link'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center h-12 bg-white/10 backdrop-blur-sm px-4">
      <Link href="/app" passHref>
        <a className="text-2xl font-bold text-gray-900">TogetLink</a>
      </Link>
      <ul className="flex items-center space-x-4">
        <li><Link href="/ai/login" passHref><a>Login</a></Link></li>
        <li><Link href="/ai/register" passHref><a>Register</a></Link></li>
        <li><Link href="/ai/dashboard" passHref><a>Dashboard</a></Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
