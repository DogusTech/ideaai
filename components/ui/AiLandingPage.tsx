import { AiLandingPage } from '@/components/ui/AiLandingPage';

export default function AiLandingPage() {
  return (
    <div>
      <h1>Ai Landing Page</h1>
      <Link href="/ai/login">
        <a>Login</a>
      </Link>
      <Link href="/ai/register">
        <a>Register</a>
      </Link>
    </div>
  );
}