import Link from 'next/link';

export function Register() {
  return (
    <div>
      <h1>Register</h1>
      <Link href="/ai">
        <a>Back to AI Dashboard</a>
      </Link>
    </div>
  );
}