import Link from 'next/link';

export function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Link href="/ai">
        <a>Back to AI Dashboard</a>
      </Link>
    </div>
  );
}