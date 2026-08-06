<!-- Import necessary components -->
import { Button, Input } from '@/components/ui';

<!-- Login Page -->
export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <Input type='text' placeholder='Username' />
      <Input type='password' placeholder='Password' />
      <Button>Submit</Button>
    </div>
  );
}