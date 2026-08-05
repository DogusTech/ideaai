import { Ai } from '@/components/ui/Ai';

export default function AiPage() {
  return (
    <div>
      <Ai />
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/register">
        <a>Register</a>
      </Link>
    </div>
  );
}