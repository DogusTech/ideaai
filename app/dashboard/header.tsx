import { Link } from 'framer-motion';

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/ai-landing-page">AI Landing Page</Link></li>
          <li><Link to="/ai">AI Dashboard</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>
      </nav>
    </header>
  );
}