<!-- Import necessary components from @/components/ui -->
import { Button, Input } from '@/components/ui';

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Input type='text' placeholder='Username' />
      <Input type='password' placeholder='Password' />
      <Button>Submit</Button>
    </div>
  );
}